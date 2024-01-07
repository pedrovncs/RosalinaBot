const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const { sendMediaImage } = require('../utils');
const { MediaType } = require('../constants');

const legenda = `🤔 Se a figurinha for animada, aqui está a imagem revertida do sticker que você me enviou, abra em um app que suporte .webp.

Você também pode converter ela para Gif aqui: _https://ezgif.com/webp-to-gif_.
(𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽 𝘄𝗲𝗯 𝘀𝗲𝗺 𝘀𝘂𝗽𝗼𝗿𝘁𝗲 𝗮 𝗲𝗻𝘃𝗶𝗼 𝗱𝗲 𝗚𝗜𝗙'𝘀)`;
const replyText = `Identifiquei que seu sticker talvez seja animado. 
Vou tentar converter, mas não garanto que vai funcionar 😅`;



async function handleSticker(sender, client, msg){
    try {
        const { data } = await msg.downloadMedia();
        const stickerPath = `./resources/sticker.webp`;
        fs.writeFile(stickerPath, data, 'base64', async function (err) {
            if (err) {
                console.error(err);
                msg.react('❌');
                msg.reply('❌ Erro ao reverter Sticker!');
                return;
            }

            fs.stat(stickerPath, function (err, stats) {
                if (err) {
                    console.error('Erro ao ler o arquivo:', err.message);
                    return;
                }
                console.log('Tamanho do arquivo em kB:', stats.size)
                if (stats.size / 1024 > 100) {
                    msg.reply(replyText);
                    const media = new MessageMedia('image/webp', data, 'sticker.webp');
                    client.sendMessage(sender, media, { sendMediaAsDocument: true, caption: legenda });
                } else {
                    msg.reply('Revertendo Sticker ⏳ ...');
                }
            });

            await sendMediaImage(sender, MediaType.Image, data);
            await msg.reply('Sticker revertido com sucesso 😎');
            try {
                fs.unlinkSync(stickerPath);
                console.log('sticker.webp removido com sucesso!');
            } catch (err) {
                console.error(`Erro ao remover sticker.webp: ${err.message}`);
            }
            msg.react('✅');
        });
    } catch (e) {
        console.error(e, JSON.stringify(msg, null, 4));
        msg.react('❌');
        msg.reply('❌ Erro ao reverter Sticker!');
    }
}

module.exports = handleSticker;