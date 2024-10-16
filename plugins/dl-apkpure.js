import axios from 'axios';

let handler = async (m, { text, conn, command }) => {
    if (!text) throw `Ex: .apk Facebook`
    try {
    if (command === 'apkpure') {
        m.react(rwait)
        let response = await axios.get(`https://ws75.aptoide.com/api/7/listSearchApps?query=${encodeURIComponent(text)}`);
        // let data = response.data.datalist.list.slice(0, 15);
        let data = response.data.datalist.list
        if (!data) throw `🙅 Not found`

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
                id: `.xapk ${app.package}`
            });
        }

        let listMessage = {
            title: '📜 Search Results for:',
            sections
        };

        await conn.sendList(
            m.chat,
            '≡ *APKPURE*🔎',
            `\n📜 Results for: *${text}*`,
            'Click to Select',
          //  data[0].icon,
            null,
            sections,
            m
        );
        m.react(done)
    } else if (command === 'xapk') {
        m.react(rwait)
        let response = await axios.get(`https://ws75.aptoide.com/api/7/listSearchApps?query=${encodeURIComponent(text)}`);
        let data = response.data.datalist.list[0]
        if (!data) throw `🙅 Not found`
        
      //  let url = text;
        let filename = data.name
        //data.file.path.split('/').pop();
        let ext = 'application/vnd.android.package-archive';
        
        let hasObb = data.obb && data.obb.main;
        if (hasObb) {
            const kyyy = await conn.sendFile(
            m.chat,
            `https://d.apkpure.com/b/XAPK/${data.package}?version=latest`,
            filename+'.xapk',
            '',
            m,
            null,
            { mimetype: ext, asDocument: true }
        );
            } else {
        const kyyy = await conn.sendFile(
            m.chat,
            `https://d.apkpure.com/b/APK/${data.package}?version=latest`,
            filename+'.apk',
            '',
            m,
            null,
            { mimetype: ext, asDocument: true }
        );
                }
        m.react(done)
    }
        } catch (err) {
            m.reply('error: '+ err)
        }
};

handler.help = ['apkpure'];
handler.tags = ['downloader'];
handler.command = ["apkpure"];

export default handler;
