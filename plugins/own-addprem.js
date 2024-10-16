let handler = async (m, {
    conn,
    text,
    args,
    usedPrefix,
    command
}) => {
    let who
   if  (m.quoted) {
        who = m.quoted.sender
} else if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[1] ? args[1] : false
    } else if (args[1]) {
        who = args[1] + '@s.whatsapp.net'
    }
    let user = db.data.users[who]
    if (!who) throw `من يريد أن يصبح مميزاً عزيزي؟!`

    if (!args[0]) throw `كم يوما تريد؟؟'

    if (args[0] == 'permanen') {
        user.premium = true
        user.premiumTime = 0
        await m.reply(`Success
*Name:* ${user.name}
*Time:* ${args[0]}`)
        await conn.reply(who, `Information premium
*Name:* ${user.name}
*Time:* ${args[0]}`, null)
    } else {
        if (isNaN(args[0])) return m.reply(`Only Number!\n\nExample:\n${usedPrefix + command} 30 @${m.sender.split`@`[0]}`)
        let txt = args[0]
        var jumlahHari = 86400000 * txt

        var now = new Date() * 1
        if (now < user.premiumTime) {
            user.premiumTime += jumlahHari
        } else {
            user.premiumTime = now + jumlahHari
        }
        user.premium = true
        await m.reply(`Success
*Name:* ${user.name}
*Time:* ${txt} day`)
        await conn.reply(who, `Information premium 
*Name:* ${user.name}
*Time:* ${txt} day`, null)
    }
}
handler.help = ['addprem']
handler.tags = ['owner']
handler.command = /^(add|\+)p(rem)?$/i

handler.group = false
handler.owner = true

export default handler