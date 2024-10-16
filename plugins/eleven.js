import axios from 'axios';

let handler = async (m, { conn, text }) => {

  const voiceResponse = await axios.get('https://api.elevenlabs.io/v1/voices');
  const voices = voiceResponse.data.voices;

  if (!text) {
    const voiceList = voices.map((voice, index) => `${index + 1}. ${voice.name} (${voice.labels.description})`).join('\n');
    return m.reply(`ex: .eleven <num>|<text>\n\n${voiceList}`);
  }
  if (text.length > 500) return m.reply('Input text too long. Maximum length is 500 characters.');

  const [voiceNumber, textToSpeechh] = text.split("|")
  const voiceId = voices[parseInt(voiceNumber) - 1].voice_id;

    const textToSpeech = textToSpeechh || m.quoted?.text || "hello"
  await m.react("🗣️");
  const data = JSON.stringify({ text: textToSpeech, model_id: "eleven_multilingual_v2" });
  const config = {
    method: 'POST',
    url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?allow_unauthenticated=1`,
    headers: { 'Content-Type': 'application/json' },
    data,
    responseType: 'arraybuffer'
  };

  try {
    const response = await axios(config);
    const buffer = Buffer.from(response.data, 'binary');

    await conn.sendFile(m.chat, buffer, 'audio.mp3', null, m, true, { type: 'audioMessage', ptt: true });
    m.react("✅");
  } catch (error) {
    m.react("❌");
    console.error(`Error fetching audio from Eleven Labs API: ${error.message}`);
      // Unable to generate audio. Please try again later.
    m.reply('Error');
  }
};

handler.command = ["eleven", "elevenlabs"];
export default handler;