let handler = async (m, { conn, command, usedPrefix }) => {
    // رابط الملف الصوتي الجديد
    let vn = 'https://files.catbox.moe/vp6xt8.mp3'
    
    // إرسال حالة "recording" لإعلام المستخدم بأن البوت يقوم بتسجيل صوتي
    conn.sendPresenceUpdate('recording', m.chat)

    try {
  
        await conn.sendMessage(m.chat, { text: `
[❗] لإستخدام البوت اكتب هذا الأمر:\n\n- *.${command}menu*
\n` + global.copyright, id: `.menu`}, { quoted: m })
    } catch (error) {
        console.error('Error sending audio:', error)
    }
}

// تحديد الأوامر التي يجب أن يستجيب لها البوت
handler.customPrefix = /^(hi|hello|سلام|سَلَام|slm|menu|ا|ª|A?$)/i
handler.command = /^(hi|hello|سلام|سَلَام|slm|menu|ا|ª|A?$)/i

export default handler