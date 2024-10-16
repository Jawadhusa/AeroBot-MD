/*import fetch from 'node-fetch';

import uploader from '../lib/uploadImage3.js';

const handler = async (m, { conn, text, command, usedPrefix }) => {

    try {

        if (!text) {

            throw `مثال: \n${usedPrefix+command} مرحبا`;

        }

        let BK9api, BK9img;

        if (m.quoted && /image/g.test((m.quoted.msg || m.quoted).mimetype || m.quoted.mediaType || '') && !/webp/g.test((m.quoted.msg || m.quoted).mimetype || m.quoted.mediaType || '')) {

            let BK0 = await m.quoted.download();

            BK9img = await uploader(BK0);

            BK9api = await (await fetch(`https://bk9.fun/ai/geminiimg?url=${BK9img}&q=${text}`)).json();

        } else {

            BK9api = await (await fetch(`https://bk9.fun/ai/gemini?q=${encodeURIComponent(text)}`)).json();

        }

        if (BK9api.status && BK9api.BK9) {

            const respuestaAPI = BK9api.BK9;

            conn.reply(m.chat, respuestaAPI, m);

        } else {

            throw "حدث خطأ أثناء معالجة طلبك.";

        }

    } catch (error) {

        if (typeof error === 'string') throw error;

        throw `حدث خطأ أثناء معالجة طلبك.`;

    }

};

handler.help = ['gemini'];

handler.tags = ['ai'];

handler.command = /^(gemini|bard)$/i;

export default handler;*/

import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';


const handler = async (m, { conn, text, command, usedPrefix }) => {

    try {

        if (!text) {

            throw `مثال: \n${usedPrefix+command} مرحبا`;

        }

        let BK9api, BK9img;

        if (m.quoted && /image/g.test((m.quoted.msg || m.quoted).mimetype || m.quoted.mediaType || '') && !/webp/g.test((m.quoted.msg || m.quoted).mimetype || m.quoted.mediaType || '')) {

            let BK0 = await m.quoted.download();

            BK9img = await tourl(BK0);

            BK9api = await (await fetch(`https://bk9.fun/ai/geminiimg?url=${BK9img}&q=${text}`)).json();

        } else {

            BK9api = await (await fetch(`https://bk9.fun/ai/gemini?q=${encodeURIComponent(text)}`)).json();

        }

        if (BK9api.status && BK9api.BK9) {

            const respuestaAPI = BK9api.BK9;

            conn.reply(m.chat, respuestaAPI, m);

        } else {

            throw "حدث خطأ أثناء معالجة طلبك.";

        }

    } catch (error) {

        if (typeof error === 'string') throw error;

        throw `حدث خطأ أثناء معالجة طلبك.`;

    }

};

handler.help = ['gemini'];

handler.tags = ['ai'];

handler.command = /^(gemini|bard)$/i;

export default handler;

async function tourl(buffer) {
    let { ext } = await fileTypeFromBuffer(buffer);
    let form = new FormData();
    form.append("fileToUpload", buffer, `file.${ext}`);
    form.append("reqtype", "fileupload");

    let res = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: form,
    });

    let data = await res.text();
    return data;
}
