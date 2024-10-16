
let handler = async (m, {conn}) => {
    if (!m.quoted) throw 'Please reply to a channel message'
    try {
        let id = (await m.getQuotedObj()).msg.contextInfo.forwardedNewsletterMessageInfo
        await m.reply(`Name: ${id.newsletterName}\nId: ${id.newsletterJid}`)
    } catch (e) {
        throw 'It must be a chat from a channel'
    }
}
handler.help = handler.command = ['ci', 'cid']
handler.tags = ['main']
export default handler