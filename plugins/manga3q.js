import axios from 'axios';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import *as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    if (m.isGroup) return

    let lister = ["search", "chapter", "pdf"];
    let [feature, inputs] = text.split("|");

   // if (!text) throw `Example: ${usedPrefix + command} search|query`
    /*if (!lister.includes(feature)) {
        return m.reply(`هذا الامر خاص بتحميل قصص المانغا على شكل pdf مثال نكتب هكذا\n\n*.manga search|naruto*\n\n\n*الأوامر التي سوف تستعلمها في هذا الأمر*\n` + lister.map((v) => `  ○ ${v}`).join("\n"));
    }*/

   /*if (feature === "search" || !lister.includes(feature)) {
    
        if (!inputs && feature === "search") return m.reply("مثال:\n *.manga search|naruto*");*/
            if (!lister.includes(feature) || !text) {
                
        
       // await m.reply(wait);
        try {
            let res = await search3asq(text);
            if (!res) throw "not found"
            let sections = [
                {
                    title: `نتائج البحث عن: ${text || 'مانغا شعبية'}`,
                    highlight_label: "رائج 🔥",
                    rows: res.map((item, index) => ({
                        title: item.name,
                        description: `أسماء بديلة: ${item.alternativeNames || 'لا يوجد'} | التصنيفات: ${item.genres}`,
                        id: `.manga chapter|${item.link}`
                    }))
                }
            ];
            //conn.sendMessage(m.chat,{text:"data: \n"+res[0].link})

            await conn.sendList(
                m.chat,
                '≡ *مانجا العاشق*🔎',
                `📜 نتائج البحث عن:\n*${text||'مانغا شعبية'}*`,
                'انقر لتحديد',
                '',
                sections,
                m
            );
           
        } catch (e) {
            await console.log(e);
        }
    }

    if (feature === "chapter") {
        if (!inputs) return m.reply("مثال:\n *.manga search|naruto*");
        await m.reply(wait);
        try {
            let res = await getAllChapters(inputs);
           // res = res.slice(0, 15);
            let sections = [
                {
                    title: `قائمة الفصول`,
                    highlight_label: "فصل جديد",
                    rows: res.map((item, index) => ({
                        title: item.title.split('\n')[0],
                        description: `تاريخ الإصدار: ${item.releaseDate} | المشاهدات: ${item.views}`,
                        id: `.manga pdf|${item.link}`
                    }))
                }
            ];
            let { imglink, mtitle } = await getImg(inputs)

            await conn.sendList(
                m.chat,
                '≡ *مانجا العاشق*🔎',
                `📜 قائمة فصول مانغا ${mtitle}`,
                'انقر لتحديد',
                imglink,
                sections,
                m
            );
        } catch (e) {
            await m.reply(eror);
        }
    }

    if (feature === "pdf") {
        if (!inputs) return m.reply("مثال:\n *.manga search|naruto*");
        await m.reply(wait);
        try {
            let data = await getChapterPdfB(inputs);
            const [, mangaTitle, chapterNumber] = inputs.match(/manga\/([^/]+)\/(\d+)\/$/);
            const pdfTitle = `${mangaTitle.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())} : ${chapterNumber}`;
            

            await conn.sendFile(m.chat, data, pdfTitle, "تم التحميل بنجاح ✅", m, null, {
                mimetype: 'application/pdf',
                contextInfo: {
                    mentionedJid: [m.sender]
                }
            });
        } catch (e) {
            await m.reply('*خطأ في إرسال الملف.*');
        }
    }
};

handler.help = ["manga"];
handler.tags = ["internet"];
handler.command = /^(manga)$/i;
export default handler;

async function search3asq(q) {
    try {
        const { data } = await axios.get(`https://3asq.org/?s=${q}&post_type=wp-manga`);
        const $ = cheerio.load(data);

        return $('.tab-summary').map((index, element) => ({
            name: $(element).find('.post-title h3 a').text().trim(),
            link: $(element).find('.post-title h3 a').attr('href'),
            alternativeNames: $(element).find('.mg_alternative .summary-content').text().trim(),
            genres: $(element).find('.mg_genres .summary-content a').map((i, el) => $(el).text()).get().join(', ')
        })).get();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getAllChapters(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        return $('.wp-manga-chapter').map((index, element) => ({
            title: $(element).text().trim(),
            link: $(element).find('a').attr('href'),
            releaseDate: $(element).find('.chapter-release-date i').text().trim(),
            views: $(element).find('.view').text().trim(),
        })).get();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getImg(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        //.find('a')
        return {
            imglink: $('.summary_image img').attr('src'),
            mtitle: $('.post-title h1').text().trim()
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getChapterPdf(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const buffers = [];
        const pdfDoc = new PDFDocument();
        const pdfStream = new PassThrough();
        pdfDoc.pipe(pdfStream);

        const imageLinks = $('.wp-manga-chapter-img').map((index, element) =>
            $(element).attr('src').trim()).get();

        if (imageLinks.length === 0) {
            console.log('No images found.');
            return null;
        }

        for (const [index, imageLink] of imageLinks.entries()) {
            try {
                const imageResponse = await axios.get(imageLink, { responseType: 'arraybuffer' });
                await pdfDoc.addPage().image(Buffer.from(imageResponse.data), { fit: [pdfDoc.page.width, pdfDoc.page.height] });
            } catch (error) {
                console.error(`Error processing image ${index + 1}:`, error);
            }
        }

        pdfDoc.end();

        pdfStream.on('data', (chunk) => buffers.push(chunk));

        return new Promise((resolve) => 
pdfStream.on('end', () => resolve(Buffer.concat(buffers))));
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


// edit
async function getChapterPdfB(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const buffers = [];
        const pdfDoc = new PDFDocument();
        const pdfStream = new PassThrough();
        pdfDoc.pipe(pdfStream);

        
        
        const firstImageLink = 'https://www.gravatar.com/avatar/0bdfa5b6e04dc024b4251869295b2c1d';
        try {
            const firstImageResponse = await axios.get(firstImageLink, { responseType: 'arraybuffer' });
            const firstImageBuffer = Buffer.from(firstImageResponse.data);

            const img = pdfDoc.openImage(firstImageBuffer);
            const pageWidth = pdfDoc.page.width;
            const pageHeight = pdfDoc.page.height;

            const imgWidth = img.width;
            const imgHeight = img.height;

            if (imgHeight > pageHeight) {
                const scale = pageWidth / imgWidth;
                const scaledHeight = imgHeight * scale;
                const pagesRequired = Math.ceil(scaledHeight / pageHeight);
        

                for (let page = 0; page < pagesRequired; page++) {
                    if (page > 0) pdfDoc.addPage();
                    const yOffset = -(page * pageHeight);
                    pdfDoc.image(firstImageBuffer, 0, yOffset, { width: pageWidth });
                }
            } else {
                pdfDoc.image(firstImageBuffer, 0, 0, { fit: [pageWidth, pageHeight] });
            }

        } catch (error) {
            console.error('Error processing the first image:', error);
        }
        
        const imageLinks = $('.wp-manga-chapter-img').map((index, element) =>
            $(element).attr('src').trim()).get();
        //imageLinks.unshift('');

        if (imageLinks.length === 0) {
            console.log('No images found.');
            return null;
        }
       

        for (const [index, imageLink] of imageLinks.entries()) {
            try {
                const imageResponse = await axios.get(imageLink, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(imageResponse.data);

                const img = pdfDoc.openImage(imageBuffer);
                const imgWidth = img.width;
                const imgHeight = img.height;

                const pageWidth = pdfDoc.page.width;
                const pageHeight = pdfDoc.page.height;

                if (imgHeight > pageHeight) {
                    const scale = pageWidth / imgWidth;
                    const scaledHeight = imgHeight * scale;
                    const pagesRequired = Math.ceil(scaledHeight / pageHeight);

                    for (let page = 0; page < pagesRequired; page++) {
                        pdfDoc.addPage();
                        const yOffset = -(page * pageHeight);
                        pdfDoc.image(imageBuffer, 0, yOffset, { width: pageWidth });
                    }
                } else {
                    pdfDoc.addPage().image(imageBuffer, 0, 0, { fit: [pageWidth, pageHeight] });
                }

            } catch (error) {
                console.error(`Error processing image ${index + 1}:`, error);
            }
        }

        pdfDoc.end();

        pdfStream.on('data', (chunk) => buffers.push(chunk));

        return new Promise((resolve) =>
            pdfStream.on('end', () => resolve(Buffer.concat(buffers)))
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
