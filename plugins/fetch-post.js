import fetch from 'node-fetch';
import { format } from 'util';
import fs from 'fs';

const handler = async (m, { text }) => {
  if (!text) throw 'invalid URL and JSON data.';

  let [url, body] = text.split('=>');
  if (!/^https?:\/\//.test(url)) throw 'URL!?';
if (!body && m.quoted && m.quoted.text) {
  body = m.quoted.text;
}
    if (!body) throw 'JSON?'
   // const _body = JSON.stringify(body);
    const _body = JSON.parse(body);

  const apiUrl = new URL(url);
  const searchParams = Object.fromEntries(apiUrl.searchParams.entries());

  if (!searchParams.apikey) {
    searchParams.apikey = 'key';
  }

  const apiUrlWithApiKey = global.API(apiUrl.origin, apiUrl.pathname, searchParams, 'APIKEY');
  const res = await fetch(apiUrlWithApiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(_body)
  });

  const contentLength = res.headers.get('content-length');
  if (contentLength && Number(contentLength) > 500 * 1024 * 1024) {
    throw `Content-Length: ${contentLength}`;
  }

  const contentType = res.headers.get('content-type');

  if (/application\/json/.test(contentType)) {
    let txt = await res.buffer();
    try {
      txt = format(JSON.parse(txt + ''));
      m.reply(txt.slice(0, 65536) + '');
      return conn.sendFile(m.chat, Buffer.from(txt), 'response.json', url, m);
    } catch (e) {
      m.reply('Error');
    }
  } else if (/text/.test(contentType)) {
    let txt = await res.text();
    m.reply(txt.slice(0, 65536) + '');
  } else {
    return conn.sendFile(m.chat, apiUrlWithApiKey, 'file', url, m);
  }
};

handler.help = ['post'].map((v) => v + ' <url>\n<JSON data>');
handler.tags = ['internet'];
handler.command = /^(post)$/i;
handler.rowner = true;
export default handler;