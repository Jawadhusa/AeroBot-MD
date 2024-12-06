import svdl from '@blackamda/song_video_dl';


  const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
      throw `مثال:\n- ${usedPrefix + command} link`;
    }
    try {
    
      const gxres = svdl.download(text);
        m.reply(gxres);
      } else {
        throw "حدث خطأ أثناء معالجة طلبك.";
      }
    } catch (error) {
      m.react('❌');
      m.reply(error);
    }
    m.react('');
  };

handler.command = /^(gpt|ai)$/i;
handler.help = ['ytdl <text>'];
handler.tags = ['ytdl'];

export default handler;