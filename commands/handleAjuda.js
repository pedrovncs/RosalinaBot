const fs = require('fs');
const ajudaTextPath = './resources/ajuda.txt';
const ajudaText = fs.readFileSync(ajudaTextPath, 'utf8');

const handleAjuda = async (sender, client, msg) => {
    msg.react("🤔");
    client.sendMessage(sender, ajudaText, {linkPreview:false});
}

module.exports = { handleAjuda }