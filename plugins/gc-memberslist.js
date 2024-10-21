const handler = async (m, { conn }) => {
  const chatID = m.chat;
  const onlineMembers = [];

  const members = await conn.groupMetadata(chatID);
  for (const member of members.participants) {
    console.log('Member:', member);
    if (member.id && member.id && conn.user.jid && member.id.includes('@s.whatsapp.net')) {
      onlineMembers.push(`⋄ Name: ${conn.getName(member.id.split(`@`)[0] + `@s.whatsapp.net`)}\n⋄ wa.me/${member.id.split('@')[0]}\n`);
    }
  }

  if (onlineMembers.length > 0) {
    const onlineList = onlineMembers.join('\n');
    m.reply(`قائمة اعضاء المجموعة:\n\n*المجموع*: ${onlineMembers.length}\n\n${onlineList}`);
  } else {
    m.reply('لا يوجد اعضاء متصلون حاليا.');
  }
     // delete onlineMembers
      
};

handler.help = ['listmember'];
handler.command = ['listmem','listmember']
handler.tags = ['group'];
handler.group = true
export default handler;