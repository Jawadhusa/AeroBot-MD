import { igdl } from "ruhend-scraper"

let handler = m => m
handler.before = async (m, { conn }) => {

  //if (m.isBaileys || (m.isBaileys && m.fromMe && m.isGroup)) return
 // if (m.isGroup) return 
//  if (m.chat.endsWith('broadcast')) return
      if (/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)/i.test(m.text)) {try {
await m.react(rwait)
let res = await igdl(m.text)
let data = res.data       
for (let media of data) {
await new Promise(resolve => setTimeout(resolve, 2000))           
await conn.sendFile(m.chat, media.url, 'instagram.mp4')
}} catch {
await m.react('❌')
conn.reply(m.chat, '🚩 حدث خطأ ما.', m)}}
}
export default handler