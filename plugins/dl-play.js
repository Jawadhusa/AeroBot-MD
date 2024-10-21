import yts from 'yt-search'

let handler = async (m, { conn, command, text, usedPrefix, args }) => {
  if (!text) throw `Ex: *${usedPrefix + command}* Galaxy lbanj`
    await m.react(rwait)
	let res = await yts(text)
	let vid = res.videos[0]
	if (!vid) throw `Video/Audio not found`
	let { title, description, thumbnail, videoId, timestamp, views, ago, url } = vid
	
  let play = `
	≡ *YOUTUBE*
┌──────────────
▢ 📌 *Title:* ${vid.title}
▢ 📆 *Uploud:* ${vid.ago}
▢ ⌚ *Duration:* ${vid.timestamp}
▢ 👀 *Views:* ${vid.views.toLocaleString()}
└──────────────`
 await conn.sendButton2(m.chat, play, global.wm, thumbnail, [
    ['🎶 MP3 #SOON', `${usedPrefix}ytmp3 ${url}`],
    ['🎥 MP4', `${usedPrefix}alldl ${url}`]
  ], null, null, m)
}

handler.tags = ['dl']
handler.command = ['play']

export default handler
