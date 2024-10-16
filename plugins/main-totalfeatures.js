import fs from 'fs'
let handler = async (m, { conn, args, command }) => {
let fitur = Object.values(plugins).filter(v => v.help ).map(v => v.help).flat(1)
let totalf = Object.values(global.plugins).filter(
    (v) => v.help && v.tags
  ).length;
 await conn.reply(m.chat, `Owned Features ${global.namebot} Currently\nTotal: ${fitur.length} Feature`, fkon)
}
handler.help = ['totalfeatures']
handler.tags = ['main']
handler.command = ['totalfeatures']
export default handler