import axios from 'axios';

let handler = async (m, { text, conn, command }) => {
    if (!text) throw `Ex: .apk Facebook`
    
    try {
    if (command === 'apk') {
        let response = await axios.get(`https://ws75.aptoide.com/api/7/listSearchApps?query=${encodeURIComponent(text)}`);
        let data = response.data.datalist.list.slice(0, 15);
        //console.log(data)
        if (!data) throw `🙅 لم يتم العثور عليه`

        let sections = [
            {
                title: "APK Search Results",
                highlight_label: "Popular Apps",
                rows: []
            }
        ];

        for (let app of data) {
            sections[0].rows.push({
                header: app.name,
                title: app.package,
                description: `Size: ${(app.size / 1048576).toFixed(2)} MB | Rating: ${app.stats.rating.avg}`,
                id: `.apkdl ${app.package}`
            });
        }

        let listMessage = {
            title: '📜 Search Results for:',
            sections
        };

        await conn.sendList(
            m.chat,
            '≡ *APPLICATIONS*🔎',
            `\n📜 Results for: *${text}*`,
            'Click to Select',
            data[0].icon,
            sections,
            m
        );
    } else if (command === 'apkdl') {
        let response = await axios.get(`https://ws75.aptoide.com/api/7/listSearchApps?query=${encodeURIComponent(text)}`);
        let data = response.data.datalist.list[0]
        if (!data) throw `🙅 لم يتم العثور عليه`
        
      //  let url = text;
        let filename = data.name + '.apk'
        //data.file.path.split('/').pop();
        let ext = 'application/vnd.android.package-archive';

        const kyyy = await conn.sendFile(
            m.chat,
            data.file.path,
            filename,
            '',
            { key: { fromMe: false, participant: m.sender, ...(m.chat ? { remoteJid: 'BROADCAST GROUP' } : {}) }, message: { contactMessage: { displayName: `WHATSAPP - BOT`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:ATLAS-GPT\nitem1.TEL;waid=${conn.user.id.split('@')[0]}:${conn.user.id.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } } },
            null,
            { mimetype: ext, asDocument: true }
        );
        let hasObb = data.obb && data.obb.main;
        if (hasObb) {
            await conn.sendButton2(
                m.chat,
                'تم إرسال ملف APK!',
                'انقر أدناه لتنزيل ملف OBB',
                '',
                [['تنزيل OBB', '.apkobb '+ text]],
                null,
                null,
                kyyy
            );
            }
    } else if (command === 'apkobb') {
        let response = await axios.get(`https://ws75.aptoide.com/api/7/listSearchApps?query=${encodeURIComponent(text)}`);
        let data = response.data.datalist.list[0]
        if (!data) throw `🙅 Not found`
        
        let url = data.obb.main.path;
        let filename = data.obb.main.filename
        let ext = 'application/vnd.android.obb';
       // await m.reply(`${filename} ${url} ${ext}`)

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
            m.reply("error:", error.message)
        }
};

handler.help = ['aptoide'];
handler.tags = ['downloader'];
handler.command = ["apk", "apkdl", "aptoide"];

export default handler;
