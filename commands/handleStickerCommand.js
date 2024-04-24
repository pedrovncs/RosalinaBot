const { handleStickerGeneration } = require("../utils/utils")

async function handleStickerCommand(sender,client, msg){
    try {
        await handleStickerGeneration(msg, sender)
    } catch (e) {
        console.error(`Erro ao gerar Sticker: ${e.message}`)
        msg.reply("❌ Erro ao gerar Sticker!")
        msg.react("❌")
    }
}

module.exports = handleStickerCommand