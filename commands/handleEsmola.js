const { MessageMedia } = require('whatsapp-web.js');

const message = require('../config').esmolaMessage;

async function handleEsmola(sender,client, msg) {
    try {
        msg.react("🤑");
        messagemedia = MessageMedia.fromFilePath('./resources/pix-code.png');
        await msg.reply(messagemedia, sender,{caption: message});
    } catch (e) {
        console.log(`erro encontrado enviando dados de esmola: ${e}`);
        msg.reply("❌ Deu ruim, mas tenta de novo depois 😭");
        msg.react("❌");
    }
}

module.exports = handleEsmola;
