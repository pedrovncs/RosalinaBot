const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const readlineSync = require('readline-sync');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');
const config = require('./config.js');
const { allowedIds } = config;
const urlRegex = require('url-regex');
const {Commands} = require('./constants');
const { STICKER_COMMAND } = Commands;
const { MediaType } = require('./constants');
let defaultClient = null;

async function cleanUp(client) {
    defaultClient = client;
    const cleanTime = 0;
    await new Promise(resolve => setTimeout(resolve, cleanTime));
    for (const id of allowedIds) {
        const chat = await defaultClient.getChatById(id);
        try {
            await chat.clearMessages();
            console.log(`Chat ${id} limpo com sucesso.`);
        } catch (error) {
            console.error(`Erro ao limpar o chat ${id}:`, error);
        }
    }
    console.log(`Chats limpos após aguardar ${cleanTime / 1000} segundos.`);
    return true;
}

function getDefaultFfmpegPath() {
    const isWindows = process.platform === 'win32';
    const isLinux = process.platform === 'linux';

    if (isWindows) {
        return "C:\\Users\\pedro\\Downloads\\ffmpeg-2023-11-20-git-e56d91f8a8-full_build\\bin\\ffmpeg.exe";
    } else if (isLinux) {
        return "/usr/bin/ffmpeg";
    } else {
        throw new Error('Sistema operacional não suportado');
    }
}

async function resizeImage(imageData, resizeWidth) {
    if (resizeWidth === null) {
        return imageData;
    }
    try {
        const resizedImageBuffer = await sharp(Buffer.from(imageData, 'base64'))
            .resize({ width: resizeWidth, height: resizeWidth })
            .toBuffer();
        return resizedImageBuffer.toString('base64');
    } catch (error) {
        console.error('Error resizing image:', error);
        throw error; 
    }
}

async function generateSticker(msg, sender) {
    try {
        await handleStickerGeneration(msg, sender);
    } catch (error) {
        console.error('Error generating sticker:', error.message);
        await msg.reply("❌ Erro ao gerar Sticker!");
        msg.react("❌");
    }
}

async function handleStickerGeneration(msg, sender) {
    await msg.reply("Transformando ⏳ ...");
    await msg.react("⏳");
    const commandParts = msg.body.split(" ");
    const stickerSizeCommandIndex = commandParts.indexOf(STICKER_COMMAND);
    const resizeWidth = getSizeFromCommand(commandParts, stickerSizeCommandIndex);
    switch (msg.type) {
        case "image":
            await handleImageStickerGeneration(msg, sender, resizeWidth);
            break;
        case "video":
            await handleVideoStickerGeneration(msg, sender);
            break;
        case "chat":
            await handleChatStickerGeneration(msg, sender, resizeWidth);
            break;
        default:
            msg.reply("❌ Erro, tipo de mídia não suportado!");
            msg.react("❌");
    }
}

async function handleImageStickerGeneration(msg, sender, resizeWidth) {
    const { data } = await msg.downloadMedia();
    const resizedImageData = await resizeImage(data, resizeWidth);
    await sendMediaSticker(msg.from, MediaType.Image, resizedImageData);
    await msg.reply("Sticker gerado com sucesso 😎");
    msg.react("✅");
}

async function handleVideoStickerGeneration(msg, sender) {
    const { data } = await msg.downloadMedia();
    await sendMediaSticker(msg.from, MediaType.Video, data);
    await msg.reply("Sticker gerado com sucesso 😎");
    msg.react("✅");
}

async function handleChatStickerGeneration(msg, sender, resizeWidth) {
    const url = msg.body.split(" ").reduce((acc, elem) => acc ? acc : (urlRegex().test(elem) ? elem : false), false);
    
    if (url) {

        await handleUrlStickerGeneration(msg, sender, resizeWidth, url);
    } else {
        await msg.reply("❌ Erro, URL inválida!");
        msg.react("❌");
    }
}

async function handleUrlStickerGeneration(msg, sender, resizeWidth, url) {
    try {
        const { headers, data } = await axios.get(url, { responseType: 'arraybuffer' });
        if (headers['content-type'].includes("image")) {
            const resizedImageData = await resizeImage(Buffer.from(data).toString('base64'), resizeWidth);
            await sendMediaSticker(msg.from, MediaType.Image, resizedImageData);
            await msg.reply("Sticker gerado com sucesso 😎");
            msg.react("✅");
        } else {
            msg.reply("❌ Erro, URL com tipo de mídia não suportado!");
            msg.react("❌");
        }
    } catch (error) {
        console.error('Error processing URL:', error.message);
        await msg.reply("❌ Erro ao processar URL!");
        msg.react("");
        msg.react("❌");
    }
}

function getSizeFromCommand(commandParts, stickerSizeCommandIndex) {
    let resizeWidth = 256;
    
    if (stickerSizeCommandIndex !== -1 && commandParts.length > stickerSizeCommandIndex + 1) {
        const sizeParam = commandParts[stickerSizeCommandIndex + 1];
        resizeWidth = getSizeFromParam(sizeParam);
    }

    return resizeWidth;
}

async function sendMediaSticker(sender, type, data){
    const media = new MessageMedia(type.contentType, data, type.fileName)
    await defaultClient.sendMessage(sender, media, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerPack: "Grifo's Gallery" })
}

async function sendMediaImage(sender, type, data){
    const media = new MessageMedia(type.contentType, data, type.fileName);
    await defaultClient.sendMessage(sender, media);
}

function getSizeFromParam(param){
    switch (param.toLowerCase()) {
        case '-baixo':
            return 72;
        case '-alto':
            return 512;
        case '-original':
            return null;
        default:
            return parseInt(param) || 256;
    }
}

function saveLastDeployTime(lastDeployTime) {
    try {
        const configPath = './config.js';
        let config = require(configPath);

        config.lastDeployTime = lastDeployTime.toISOString();

        fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};`);
        console.log('Last deploy time saved successfully.');
    } catch (error) {
        console.error('Error saving last deploy time:', error);
    }
}

module.exports = {
    getDefaultFfmpegPath,
    resizeImage,
    sendMediaSticker,
    sendMediaImage,
    getSizeFromParam,
    generateSticker,
    saveLastDeployTime,
    cleanUp,
}