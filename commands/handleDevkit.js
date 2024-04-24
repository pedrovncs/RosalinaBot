const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

const handleDevkit = async (sender,client, msg) => {
    await msg.react("🛠");
    msg.reply("Estou preparando os arquivos, em breve te envio! ✨");
    const target = msg.author;
    const media = MessageMedia.fromFilePath('./resources/answer_devkit.zip');
    await msg.reply(media,target, { sendMediaAsDocument: true, caption: "Aqui estão os arquivos! 🛠"});
}

module.exports = { handleDevkit }