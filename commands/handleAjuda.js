const fs = require('fs');
const ajudaTextPath = './resources/ajuda.txt';
const ajudaText = fs.readFileSync(ajudaTextPath, 'utf8');

const handleAjuda = async (sender, client, msg) => {
    await msg.react("🤔");
    await client.sendMessage(sender, ajudaText);
}

module.exports = { handleAjuda }