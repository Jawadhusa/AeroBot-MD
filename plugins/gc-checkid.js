let handler = async (m, {
    conn,
    groupMetadata
}) => {
    conn.reply(m.chat, `${await groupMetadata.id}`, m)
}
handler.help = ['checkid']
handler.tags = ['group']
handler.command = /^(checkid|idgc|gcid)$/i

handler.group = true
handler.owner = true

export default handler