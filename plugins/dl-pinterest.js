import axios from 'axios';

let handler = async (m, { conn, command, text }) => {
    if (!text) throw `prompt!`;

    const pinterestApiUrl = `https://apis-starlights-team.koyeb.app/starlight/pinterest-search?text=${text}`;
    let response;

    try {
        response = await axios.get(pinterestApiUrl);
    } catch (err) {
        throw `Error fetching data from Pinterest API: ${err}`;
    }

    const results = response?.data?.results;
    if (!results || results.length === 0) throw `No images found for: ${text}`;

    const images = results.slice(0, 4);

    for (let img of images) {
        const imgo = img.image;
        const title = img.title;
        const id = img.id

        await conn.sendMessage(m.chat, {
            image: { url: imgo },
            caption: `*▢  Title:* ${title}`,
            fileName: `${id}.jpg`,
            mimetype: 'image/jpeg'
        });
    }

    conn.sendMessage(m.sender, { react: { text: "✅", key: m.key } });
}

handler.command = /^pinterest$/i;

export default handler;
