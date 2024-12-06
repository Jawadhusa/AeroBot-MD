const {
    proto,
    generateWAMessage,
    areJidsSameUser
} = (await import('@whiskeysockets/baileys')).default

export async function before(m, chatUpdate) {
    const messageText = m.text;
    
    if (/^\d+$/.test(messageText)) {
        const number = parseInt(messageText);
        const nrplyData = global.db.data.nrply;

        if (nrplyData && nrplyData[m.quoted?.id] && nrplyData[m.quoted.id][number]) {
            m.react(rwait);

            const replyText = nrplyData[m.quoted.id][number];
            let messages = await generateWAMessage(m.chat, { text: replyText, mentions: m.mentionedJid }, {
                userJid: m.sender || this.user.id,
                quoted: m.quoted && m.quoted.fakeObj
            });
            messages.key.fromMe = areJidsSameUser(m.sender, this.user.id);
            messages.key.id = m.key.id;
            messages.pushName = m.name;

            let msg = {
                ...chatUpdate,
                messages: [proto.WebMessageInfo.fromObject(messages)].map(v => (v.conn = this, v)),
                type: 'append'
            };
            this.ev.emit('messages.upsert', msg);

            setTimeout(() => {
                m.react('');
            }, 10 * 1000);
        } else {
            return;
        }
    } else {
        return;
    }
}
