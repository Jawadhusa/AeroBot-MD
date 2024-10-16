import fg from 'api-dylux'
let limit = 320
const mssg = {
  example: 'مثال على استخدام الأمر',
  noLink: (type) => `❎ لا يوجد رابط صالح لـ ${type}`,
  size: 'الحجم',
  quality: 'الجودة',
  limitdl: 'تم تجاوز الحد الأقصى المسموح به للتنزيل',
  title: 'العنوان',
  error: 'حدث خطأ أثناء محاولة التنزيل'
}
let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
	if (!args || !args[0]) throw `✳️ ${mssg.example} :\n${usedPrefix + command} https://youtu.be/YzkTFFwxtXI`
    if (!args[0].match(/youtu/gi)) throw `❎ ${mssg.noLink('YouTube')}`
	 let chat = global.db.data.chats[m.chat]
	 m.react(rwait) 
	
	 let q = args[1] || '360p'
 try {
		const yt = await fg.ytv(args[0], q)
		let { title, dl_url, quality, size, sizeB } = yt
        let isLimit = limit * 1024 < sizeB 

    // await conn.loadingMsg(m.chat, '📥 جاري التنزيل', ` ${isLimit ? `≡  *FG YTDL*\n\n▢ *⚖️${mssg.size}*: ${size}\n▢ *🎞️${mssg.quality}*: ${quality}\n\n▢ _${mssg.limitdl}_ *+${limit} MB*` : '✅ تم التنزيل بنجاح' }`, ["▬▭▭▭▭▭", "▬▬▭▭▭▭", "▬▬▬▭▭▭", "▬▬▬▬▭▭", "▬▬▬▬▬▭", "▬▬▬▬▬▬"], m)
     
	  if(!isLimit) conn.sendFile(m.chat, dl_url, title + '.mp4', `
 ≡  *YTDL*
  
*📌${mssg.title}:* ${title}
*🎞️${mssg.quality}:* ${quality}
*⚖️${mssg.size}:* ${size}
`.trim(), m, false, { asDocument: true })
		m.react(done) 
 	} catch {
		await m.reply(`❎ ${mssg.error}`)
	}
} 

handler.command = ['ytmp4', 'fgmp4']

export default handler
