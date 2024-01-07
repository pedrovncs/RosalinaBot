const { generateSticker } = require("../utils")

async function handleStickerCommand(sender,client, msg){
    try {
        await generateSticker(msg, sender)
    } catch (e) {
        console.error(e, JSON.stringify(msg, null, 4))
        msg.reply("❌ Erro ao gerar Sticker!")
        msg.react("❌")
    }
}

module.exports = handleStickerCommand