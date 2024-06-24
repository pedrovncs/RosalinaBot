const { MessageMedia } = require('whatsapp-web.js');
const { sendMediaImage } = require('../utils/utils');

const message = 
`
mim da uns trocado ai, to passando necessidade aws ta caro 😭

Chaves PIX:

QR Code abaixo acima
☎️Telefone: 21959019162
📧Email: rosalina.esmola@gmail.com

`


async function handleEsmola(sender,client, msg) {
    try {
        const mediaPix = MessageMedia.fromFilePath('./resources/pix-code.png');
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
