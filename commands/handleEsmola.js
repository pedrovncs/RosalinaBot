const { MessageMedia } = require('whatsapp-web.js');


async function handleEsmola(sender,client, msg) {
    try {
        const mediaPix = MessageMedia.fromFilePath('./resources/pix-code.png');
        msg.react("🤑");
        await msg.reply("mim da uns trocado ai, to passando necessidade aws ta caro 😭");
        await client.sendMessage(sender, mediaPix, { sendMediaAsSticker: true });
        await client.sendMessage(sender, "🔑 Outras chaves: ");
        await client.sendMessage(sender, "☎️Telefone: 21959019162");
        await client.sendMessage(sender, "📧Email: rosalina.esmola@gmail.com");
    } catch (e) {
        console.log(`erro encontrado enviando dados de esmola: ${e}`);
        msg.reply("❌ Deu ruim, mas tenta de novo depois 😭");
        msg.react("❌");
    }
}

module.exports = handleEsmola;
