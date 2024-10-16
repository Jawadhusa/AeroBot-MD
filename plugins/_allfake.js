import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
import axios from 'axios'
import speed from 'performance-now'


let handler = m => m
handler.all = async function(m) {
    let name = await conn.getName(m.sender)
    let pp = 'https://i.ibb.co/hLkvk0Y/High-resolution-wallpaper-background-ID-77700531426.jpg'
    let fotonyu = 'https://i.ibb.co/hLkvk0Y/High-resolution-wallpaper-background-ID-77700531426.jpg'
    try {
        pp = await this.profilePictureUrl(m.sender, 'image')
    } catch (e) {} finally {



        global.emror = 'https://telegra.ph/file/a6294049a1863a69154cf.jpg'

        global.doc = pickRandom(["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/pdf"])
        global.fsizedoc = pickRandom([2000, 3000, 2023000, 2024000])

        /* Module 
        global.skrep = (await import('../scraper/scrape.js'))
        global.skrep2 = (await import('../scraper/scrape2.js'))
        global.skrep3 = (await import('../scraper/scrape3.js'))
        global.skrepdl = (await import('../scraper/scrape_dl.js'))
        global.skrep4 = (await import('../scraper/scrape4.js'))
        global.skreps = (await import('../scraper/scrape-search.js'))
        global.skrepdl = (await import('../scraper/scrape_dl.js')) */

        // modul
        global.axios = (await import('axios')).default
        global.fetch = (await import('node-fetch')).default
        global.cheerio = (await import('cheerio')).default
        global.fs = (await import('fs')).default

        let timestamp = speed();
        let latensi = speed() - timestamp;
        let ms = await latensi.toFixed(4)
        const _uptime = process.uptime() * 1000

        // Ini untuk command crator/owner
        global.kontak2 = [
            [owner[0], await conn.getName(owner[0] + '212660131536@s.whatsapp.net'), 'Hardy', 'https://whatsapp.com', true],
        ]

        global.fkon = {
            key: {
                fromMe: false,
                participant: m.sender,
                ...(m.chat ? {
                    remoteJid: 'BROADCAST GROUP'
                } : {})
            },
            message: {
                contactMessage: {
                    displayName: `${name}`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        }

        global.fVerif = {
            key: {
                participant: '0@s.whatsapp.net',
                remoteJid: "0@s.whatsapp.net"
            },
            message: {
                conversation: `_${global.namebot} Verified by WhatsApp_`
            }
        }
    

    // pesan sementara
    global.ephemeral = '86400'


    global.ucapan = ucapan()
    global.botdate = date()

    global.adReply = {
        contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                "newsletterJid": "120363306922887441@newsletter",
                "serverMessageId": 103,
                "newsletterName": `⌜ Aero - Bot - MD ⌟ - Ping: ${ms}`

            },
            externalAdReply: {
                showAdAttribution: true,
                title: namebot,
                body: ucapan(),
                previewType: "VIDEO",
                thumbnailUrl: logo,
                sourceUrl: 'https://www.hardy.host',

            }
        }
    }

    global.fakeig = {
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: namebot,
                body: ucapan(),
                thumbnailUrl: pp,
                sourceUrl: sig
            }
        }
    }
}
}

export default handler

function date() {
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, {
        weekday: 'long'
    })
    let date = d.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    let tgl = `${week}, ${date}`
    return tgl
}

function ucapan() {
    const time = moment.tz('Africa/Casablanca').format('HH')
    let res = "Thank's to HARDY HOST"
    if (time >= 4) {
        res = "Thank's to HARDY HOST"
    }
    if (time > 10) {
        res = "Thank's to HARDY HOST"
    }
    if (time >= 15) {
        res = "Thank's to HARDY HOST"
    }
    if (time >= 18) {
        res = "Thank's to HARDY HOST"
    }
    return res
}

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
}