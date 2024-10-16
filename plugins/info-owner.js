/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/

import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, text, args, command }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let name = await conn.getName(who)

// FAKE KONTAK
 const repPy = {
	key: {
		remoteJid: '0@s.whatsapp.net',
		fromMe: false,
		id: wm,
		participant: '0@s.whatsapp.net'
	},
	message: {
		requestPaymentMessage: {
			currencyCodeIso4217: "USD",
			amount1000: 999999999,
			requestFrom: '0@s.whatsapp.net',
			noteMessage: {
				extendedTextMessage: {
					text: namebot
				}
			},
			expiryTimestamp: 999999999,
			amount: {
				value: 91929291929,
				offset: 1000,
				currencyCode: "MAD"
			}
		}
	}
}
	    	const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(global.nomerown + '@s.whatsapp.net')}\nFN:${await conn.getName(global.nomerown + '@s.whatsapp.net')}\nitem1.TEL;waid=${global.nomerown}:${global.nomerown}\nitem1.X-ABLabel:Mobile\nitem2.EMAIL;type=INTERNET:hardyhg984@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://instagram.com/hardy_js\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Morocco;;;;\nEND:VCARD`
	    
	
	const msg = await conn.sendMessage(m.chat, {contacts: { displayName: global.nameown, contacts: [{ vcard }] }, contextInfo: {
      externalAdReply: {
      title: await style(command, 1),
      body: await style('AERO - BOT OWNER', 1),
      thumbnail: await conn.resize('https://i.ibb.co/StsCwgd/20241015-234507.jpg', 300, 180),
      sourceUrl: `https://www.hardy.host`,
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, { quoted: repPy})
    

 // await conn.reply(m.chat, `${name} is my real owner`, msg)
  } 

handler.help = ['owner', 'creator']
handler.tags = ['main']
handler.command = /^(owner|creator)/i
export default handler