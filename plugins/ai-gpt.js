import fetch from 'node-fetch';
const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `مثال:\n- ${usedPrefix + command} مرحبا`;
  }
  try {
    
    const BK9api = `https://bk9.fun/ai/chatgpt?q=${encodeURIComponent(text)}`;
    const result = await fetch(BK9api);
    const data = await result.json();
    if (data.status && data.BK9) {
      const respuestaAPI = data.BK9;
      conn.reply(m.chat, data.BK9, m);
    } else {
      throw "حدث خطأ أثناء معالجة طلبك.";
    }
  } catch (error) {
    throw "حدث خطأ أثناء معالجة طلبك.";
  }
};

handler.command = /^(gpt|ai)$/i;
handler.help = ['ai <text>'];
handler.tags = ['ai'];

export default handler;
