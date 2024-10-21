/*import axios from "axios";
import * as cheerio from "cheerio";
import qs from "qs";
import fetch from "node-fetch";*/
import axios from 'axios';
import * as cheerio from 'cheerio';
import { downloadContentFromMessage } from "@whiskeysockets/baileys";

class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomError";
    }
}

class API {
    constructor(search, prefix) {
        this.api = {
            search: search,
            prefix: prefix
        };
    }

    headers(custom = {}) {
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            'authority': 'retatube.com',
            'accept': '*/*',
            'accept-language': 'id-MM,id;q=0.9',
            'hx-current-url': 'https://retatube.com/',
            'hx-request': 'true',
            'hx-target': 'aio-parse-result',
            'hx-trigger': 'search-btn',
            'origin': 'https://retatube.com',
            'referer': 'https://retatube.com/',
            'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'user-agent': 'Postify/1.0.0',
            ...custom
        };
    }

    handleError(error, context) {
        const errors = error.response ? JSON.stringify(error.response.data || error.message) : error.message;
        console.error(`[${context}] Error:`, errors);
        throw new CustomError(errors);
    }

    getEndpoint(name) {
        return this.api[name];
    }
}

class RetaTube extends API {
    constructor() {
        super('https://retatube.com/api/v1/aio/search', 'https://retatube.com/api/v1/aio/index?s=retatube.com');
    }

    async getPrefix() {
        try {
            const response = await axios.get(this.getEndpoint('prefix'));
            return this.scrapePrefix(response.data); 
        } catch (error) {
            this.handleError(error, 'GetPrefix');
        }
    }

    scrapePrefix(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const prefix = $('#aio-search-box input[name="prefix"]').val();
        return prefix;
    }

    async fetch(videoId) {
        try {
            const prefix = await this.getPrefix();
            const response = await axios.post(this.getEndpoint('search'), `prefix=${encodeURIComponent(prefix)}&vid=${encodeURIComponent(videoId)}`, { headers: this.headers() });
            return this.parseHtml(response.data);
        } catch (error) {
            this.handleError(error, 'Fetch');
        }
    }

    parseHtml(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const result = {
            title: '',
            description: '',
            videoLinks: [],
            audioLinks: []
        };

        $('.col').each((_, element) => {
            const titles = $(element).find('#text-786685718 strong').first();
            result.title = titles.text().replace('Title：', '').trim() || result.title;

            const description = $(element).find('.description').text();
            result.description = description.trim() || '';

            $(element).find('a.button.primary').each((_, linkElement) => {
                const linkUrl = $(linkElement).attr('href');
                const quality = $(linkElement).find('span').text().toLowerCase();

                if (linkUrl !== 'javascript:void(0);') {
                    if (quality.includes('audio')) {
                        result.audioLinks.push({
                            quality: quality,
                            url: linkUrl
                        });
                    } else {
                        result.videoLinks.push({
                            quality: quality,
                            url: linkUrl
                        });
                    }
                }
            });
        });

        return result;
    }

    async scrape(links) {
        try {
            return await this.fetch(links);
        } catch (error) {
            console.error(`${error.message}`);
            throw error;
        }
    }
}

const extractLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
}

const isAllowed = (Url) => {
    const regex = /^(https?:\/\/)?(www\.|web\.|m\.)?(instagram\.com\/(p|reel|tv)|fb\.watch|(www\.|web\.|m\.)?facebook\.com|(youtu|youtube)\.(be|com)\/.+|tiktok\.com\/.+|twitter\.com\/.+)$/i;

    return regex.test(Url);
}


export async function before(m) {
  if (m.fromMe) return
  let links = extractLinks(m.text);
  if (!links.length) return;

  for (let link of links) {
  				
     /* const Allowed = await isAllowed(link)
      if (!Allowed) return*/
      await m.react(rwait)
    const retatube = new RetaTube();
    try {
        const result = await retatube.scrape(link);
        let videoMessage = `*Title*: ${result.title}`;
        let audioMessage = ``;

        // Send video
        if (result.videoLinks.length > 0) {
            const video = result.videoLinks[0]; // Get the best quality video
            await conn.sendMessage(m.chat, { video: { url: video.url }, caption: videoMessage }, { quoted: m });
        } else {
            await conn.reply(m.chat, "Sorry, video not found.", m);
        }
    } catch (error) {
        await conn.reply(m.chat, `An error occurred: ${error.message}`, m);
    }
  
}
    

      await m.react(done)
}
 
async function befoore(m) {
    const fbRegex = /^https?:\/\/(?:www\.)?facebook\.com\/?.*$/;
    const igRegex = /(https?:\/\/(?:www\.)?instagram\.[a-z\.]{2,6}\/[\w\-\.]+(\/[^\s]*)?)/g;
    const tiktokRegex = /(http(?:s)?:\/\/)?(?:www\.)?(?:tiktok\.com\/@[^\/]+\/video\/(\d+))|(http(?:s)?:\/\/)?vm\.tiktok\.com\/([^\s&]+)|(http(?:s)?:\/\/)?vt\.tiktok\.com\/([^\s&]+)/g;
    const twitRegex = /https:\/\/twitter\.com\/[^/]+\/status\/(\d+)/;
    let user = db.data.users[m.sender];
    let chat = db.data.chats[m.chat]
    
    const containsLink = (text) => {
        return fbRegex.test(text) || igRegex.test(text) || tiktokRegex.test(text) || twitRegex.test(text);
    };
    if (!chat.autodl) return false;
    if (containsLink(m.text) && (!user.limit || user.limit === 0)) {
        await m.reply("limit kamu habis");
        return;
    } 
    
    try {
        if (m.text.trim().match(fbRegex)) {
            user.limit -= 1;
            const fbUrl = m.text.trim().match(fbRegex)[0];
            const { description, urls } = await facebook(fbUrl);

            await conn.sendFile(m.chat, urls[0].url, '', description, m);
        } else if (m.text.trim().match(igRegex)) {
            user.limit -= 1;
            const igUrl = m.text.match(igRegex)[0];
            const { data } = await axios.get("https://api.tioxy.my.id/api/igdl?url=" + igUrl);
            for (let i of data.data.media) {
                await conn.sendFile(m.chat, i, '', "Done", m);
            }
        } else if (m.text.trim().match(twitRegex)) {
            user.limit -= 1;
            const twitUrl = m.text.trim().match(twitRegex)[0];
            const { data: ress } = await twitter(twitUrl);
            await conn.sendFile(m.chat, ress[0].url, '', "Done", m);
        } else if (m.text.match(tiktokRegex)) {
            user.limit -= 1;
            const tiktokUrl = m.text.trim().match(tiktokRegex)[0];
            const { download, stats, uniqueId, username } = await slide(tiktokUrl);
            let hasil = Object.values(download).filter(v => v.type == "slide");
            if (hasil.length === 0) {
                await conn.sendFile(m.sender, download[0].link, '', `username: \`${username}\`\n👀: \`${stats.views}\`\n♥️: \`${stats.likes}\`\n💬: \`${stats.comments}\`\n↪️:  \`${stats.shares}\`\n📥: \`${stats.downloads}\``, m);
            } else {
                for (let i of hasil) {
                    await conn.sendFile(m.sender, i.link, '', `username: \`${username}\`\n👀: \`${stats.views}\`\n♥️: \`${stats.likes}\`\n💬: \`${stats.comments}\`\n↪️:  \`${stats.shares}\`\n📥: \`${stats.downloads}\``, m);
                }
            }
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const disabled = false;

async function twitter(url) {
    return new Promise((resolve, reject) => {
        let params = new URLSearchParams();
        params.append('URL', url);
        fetch('https://twdown.net/download.php', { method: 'POST', body: params })
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res);
                let data = [];
                $('div.container').find('tbody > tr > td').each(function (index, element) {
                    let x = $(this).find('a').attr('href');
                    if (x !== '#') {
                        if (typeof x !== 'undefined') {
                            data.push({ url: x });
                        }
                    }
                });
                if (data.length == 0) return resolve({ status: false });
                resolve({ status: true, data });
            }).catch(reject);
    });
}

async function facebook(url) {
    try {
        let { data } = await axios.post("https://getmyfb.com/process", {
            "id": url,
            locale: "en"
        }, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Cookie": `PHPSESSID=k3eqo1f3rsq8fld57fgs9ck0q9; _token=1AHD0rRsiBSwwh7ypRad; __cflb=04dToeZfC9vebXjRcJCMjjSQh5PprejvCpooJf5xhb; _ga=GA1.2.193364307.1690654540; _gid=GA1.2.326360651.1690654544; _gat_UA-3524196-5=1; _ga_96G5RB4BBD=GS1.1.1690654539.1.0.1690654555.0.0.0`,
                "Origin": "https://getmyfb.com",
                "Referer": "https://getmyfb.com/",
                "Hx-Current-Url": "https://getmyfb.com",
                "Hx-Request": true,
                "Hx-Target": "target",
                "Hx-Trigger": "form",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188"
            }
        });

        let $ = cheerio.load(data);
        let urls = [];

        $("ul > li").map((a, b) => {
            urls.push({ quality: $(b).text().trim(), url: $(b).find("a").attr("href") });
        });

        let result = {
            description: $("div.results-item > div.results-item-text").text().trim(),
            urls
        };

        if (urls.length === 0) return $("h4").text();

        return result;
    } catch (e) {
        throw e;
    }
}

async function slide(url) {
    try {
        const response = await axios.post(
            'https://ttsave.app/download',
            {
                query: url, language_id: '2'
            },
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        );

        const html = response.data;
        const $ = cheerio.load(html);

        const uniqueId = $('#unique-id').val();
        const username = $('h2.font-extrabold.text-xl.text-center').text();
        const thumbnail = $('a[target="_blank"]').attr('href');
        const profile = $('img.h-24.w-34.rounded-full').attr('src');
        const description = $('p.text-gray-600.px-2.text-center.break-all.w-3/4.oneliner').text();

        const stats = {
            views: $('svg.h-5.w-5.text-gray-500 + span').text(),
            likes: $('svg.h-5.w-5.text-red-500 + span').text(),
            comments: $('svg.h-5.w-5.text-green-500 + span').text(),
            shares: $('svg.h-5.w-5.text-yellow-500 + span').text(),
            downloads: $('svg.h-5.w-5.text-blue-500 + span').text()
        };

        const download = [];
        $('a[onclick="bdl(this, event)"]').each((i, elem) => {
            const link = $(elem).attr('href');
            const type = $(elem).attr('type');
            const title = $(elem).text().trim();
            download.push({
                link, type, title
            });
        });

        return {
            uniqueId,
            username,
            thumbnail,
            profile,
            description,
            stats,
            download
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}