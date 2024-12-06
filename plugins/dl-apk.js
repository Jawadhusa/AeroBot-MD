import axios from 'axios';

let handler = async (m, { text, conn, command }) => {
    if (!text) throw `مثال: .apk Facebook`;
    
    try {
        if (command === 'apk') {
            let response = await axios.get(`https://ws75.aptoide.com/api/7/listSearchApps?query=${encodeURIComponent(text)}`);
            let data = response.data.datalist.list.slice(0, 15);
            if (!data) throw `🙅 لم يتم العثور عليه`;

            let listMessage = `≡ *RESULTS FOR:* *${text}*\n\n`;
            let db = {};

data.forEach((app, index) => {
                let i = index + 1;
                listMessage += `${i}. ${app.name} - ${app.package}\n   Size: ${(app.size / 1048576).toFixed(2)} MB | Rating: ${app.stats.rating.avg}\n\n`;
                db[i] = `.apkdl ${app.package}`;
            });

            const msgk = await conn.reply(m.chat, listMessage, m);

            global.db.data.nrply = global.db.data.nrply || {};
            global.db.data.nrply[msgk.key.id] = db;

        } else if (command === 'apkdl') {
            let response = await axios.get(`https://ws75.aptoide.com/api/7/listSearchApps?query=${encodeURIComponent(text)}`);
            let data = response.data.datalist.list[0];
            if (!data) throw `🙅 لم يتم العثور عليه`;

            let txt = `*乂  APK - DL* 乂\n\n`
            txt += `🍟 *Name* : ${data.name}\n`
            txt += `🚩 *Package* : ${data.package}\n`
            txt += `⚖ *Size* : ${(data.size / 1048576).toFixed(2)} MB\n`;
            conn.sendFile(m.chat, data.icon, 'thumbnail.jpg', txt, m, null) 
            m.react(done)  
            let filename = data.name + '.apk';
            let ext = 'application/vnd.android.package-archive';
            let hasObb = data.obb && data.obb.main;

           const mkey = await conn.sendFile(
                m.chat,
                data.file.path,
                filename,
                hasObb ? 'جاري ارسال ملف OBB' : null,
                { key: { fromMe: false, participant: m.sender, ...(m.chat ? { remoteJid: 'BROADCAST GROUP' } : {}) }, message: { contactMessage: { displayName: `Hardy - Bot`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:ATLAS-GPT\nitem1.TEL;waid=${conn.user.id.split('@')[0]}:${conn.user.id.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } } },
                null,
                { mimetype: ext, asDocument: true }
            );

            if (hasObb) {
               
            let url = data.obb.main.path;
             filename = data.obb.main.filename;
             ext = 'application/vnd.android.obb';
            if (!url) throw `🙅 Not found`;

            await conn.sendFile(
                m.chat,
                url,
                filename,
                '',
                mkey,
                null,
                { mimetype: ext, asDocument: true }
            );
            }

        } else if (command === 'apkobb') {
            m.react(rwait);

            let response = await axios.get(`https://ws75.aptoide.com/api/7/listSearchApps?query=${encodeURIComponent(text)}`);
            let data = response.data.datalist.list[0];
            if (!data) throw `🙅 Not found`;
            
            let url = data.obb.main.path;
            let filename = data.obb.main.filename;
            let ext = 'application/vnd.android.obb';
            if (!url) throw `🙅 Not found`;

            await conn.sendFile(
                m.chat,
                url,
                filename,
                '',
                { key: { fromMe: false, participant: m.sender, ...(m.chat ? { remoteJid: 'BROADCAST GROUP' } : {}) }, message: { contactMessage: { displayName: `WHATSAPP - BOT`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:ATLAS-GPT\nitem1.TEL;waid=${conn.user.id.split('@')[0]}:${conn.user.id.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } } },
                null,
                { mimetype: ext, asDocument: true }
            );
        }
    } catch (error) {
        m.reply("Error: " + error.message);
    }
};

handler.help = ['apk'];
handler.tags = ['dl'];
handler.command = ["apk", "apkdl", "apkobb"];

handler.register = false

export default handler;