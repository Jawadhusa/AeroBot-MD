/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/

import fetch from "node-fetch";

let handler = async (m, {
    usedPrefix,
    command,
    conn,
    text,
    args
}) => {
    let input = `[!] *wrong input*
	
Ex : ${usedPrefix + command} https://youtube.com/watch?v=bzpXVCqNCoQ`
    if (!text) return m.reply(input)
    try {
        
        const apiUrl = `https://nexus-api-hazel.vercel.app/api/download/ytmp3?apikey=GataDiosV3&url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const aerodata = await response.json();
        
        
        let doc = {
            audio: {url: aerodata.result.link},
            mimetype: "audio/mp4",
            fileName: title,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 2,
                    mediaUrl: aerodata.result.link,
                    title: aerodata.result.title,
                    body: 'Title: ' + aerodata.result.title,
                    sourceUrl: 'https://www.hardy.host',
                    thumbnail: aerodata.result.thumbnail
                }
            }
        }

        await conn.sendMessage(m.chat, doc, {
            quoted: m
        })
    } catch (e) {
        throw eror
    }

}
handler.tags = ['downloader']
handler.help = ['ytmp3 <link>']
handler.command = /^(yta|ytmp3|ytaudio)$/i



export default handler