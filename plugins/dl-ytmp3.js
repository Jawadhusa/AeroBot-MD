// تحميل ملف الصوت من YouTube
import fetch from "node-fetch";

const apiKey = 'GataDiosV3'; // مفتاح API

let handler = async (m, { conn, text, args }) => {
  if (!args[0]) throw '❗ يرجى إدخال رابط فيديو YouTube.'; // تحقق من وجود رابط الفيديو

  const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/;
  if (!youtubeRegex.test(text)) throw '❌ رابط YouTube غير صالح. يرجى إدخال رابط صالح.'; // تحقق من صحة رابط YouTube

  await conn.reply(m.chat, ' جاري المعالجة...', m); // أبلغ المستخدم ببدء المعالجة

  try {
    const url = encodeURIComponent(text);
    const apiUrl = `https://api.lolhuman.xyz/api/ytaudio2?apikey=${apiKey}&url=${url}`;

    const json = await fetch(apiUrl).then(res => res.json());
      const { result } = json
      m.reply(result.id)

    if (!result) throw '❌ فشل استرجاع بيانات الصوت. يرجى التحقق من الرابط أو API.'; // تحقق من نجاح استرجاع البيانات

    const audioData = {
      audio: result.link,
      mimetype: 'audio/mpeg',
      fileName: `${result.id}.mp3`,
    };

    await conn.sendMessage(m.chat, {
      audio: result.link,
      mimetype: 'audio/mpeg',
      fileName: `${result.id}.mp3`
    }, { quoted: m });
      //await conn.sendFile(m.chat, buffer, result.id+'.mp3', null, m, true, { type: 'audioMessage', ptt: true });
  } catch (error) {
    console.error('Error:', error); // تسجيل الأخطاء
    conn.reply(m.chat, '❌ حدث خطأ أثناء جلب الصوت. يرجى المحاولة مرة أخرى.', m);
  }
};

handler.help = ['yta2', 'ytaudio2'].map(v => `yt${v} <url>`);
handler.tags = ['downloader'];
handler.command = /^(yta2(udio)?)$/i;

export default handler;