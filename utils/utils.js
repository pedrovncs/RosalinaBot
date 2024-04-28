const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const config = require('../config.js');
const { allowedIds } = config;
const urlRegex = require('url-regex');
const { Commands, MediaType } = require('../constants.js');
const { STICKER_COMMAND } = Commands;
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync('./resources/impact.ttf');
let defaultClient = null;

function initClient(client) {
    defaultClient = client;
}

async function cleanUp(cleanTime) {
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

function getDefaultChromePath() {
    const isWindows = process.platform === 'win32';
    const isLinux = process.platform === 'linux';
    if (isWindows) {
        return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    } else if (isLinux) {
        return "/usr/bin/google-chrome-stable";
    } else {
        return null;
    }
}

async function resizeImage(imageData, resizeWidth, crop) {
    if (resizeWidth === null) {
        return imageData;
    }
    try {
        const imageString = Buffer.isBuffer(imageData) ? imageData.toString('base64') : imageData;
        const resizedImageBuffer = await sharp(Buffer.from(imageString, 'base64'))
            .resize({
                width: resizeWidth,
                height: resizeWidth,
                fit: (crop ? null : sharp.fit.fill),
                position: sharp.strategy.entropy
            })
            .toBuffer();
        return resizedImageBuffer.toString('base64');
    } catch (error) {
        console.error('Error resizing image:', error);
        throw error;
    }
}

async function addTextToVideo(inputVideoPath, textUp, textDown) {
    ffmpeg.setFfmpegPath(ffmpegStatic);
    const command = ffmpeg(inputVideoPath)
        .videoFilters([]);

    const textOptions = {
        fontfile: './resources/impact.ttf', 
        fontsize: 28,
        fontcolor: 'white',
        shadowcolor: 'black',
        shadowx: 3,
        shadowy: 3
    };

    if (textUp) {
        command.videoFilters({
            filter: 'drawtext',
            options: {
                ...textOptions,
                text: textUp,
                x: '(w-text_w)/2', 
                y: 10, 
            }
        });
    }

    if (textDown) {
        command.videoFilters({
            filter: 'drawtext',
            options: {
                ...textOptions,
                text: textDown,
                x: '(w-text_w)/2', 
                y: 'h-text_h-10', 
            }
        });
    }

    return new Promise((resolve, reject) => {
        command
            .output('./resources/outputs/tempWithText.mp4')
            .on('end', () => {
                console.log('Processamento de vídeo concluído');
                resolve();
            })
            .on('error', (err) => {
                console.error('Erro ao processar vídeo:', err);
                reject(err);
            })
            .run();
    });
}


async function addTextToImage(imageData, textUp, textDown, crop) {
    const inputImagePath = './resources/tempInput.png';
    const outputImagePath = './resources/tempOutput.png';

    fs.writeFileSync(inputImagePath, imageData, 'base64');

    if (!textUp && !textDown) {
        return imageData;
    }

    const attributes = { fill: 'white', stroke: 'black', 'stroke-width': 2 };
    const options = { x: 0, y: 0, fontSize: 70, anchor: 'top', attributes: attributes };

    const svgUp = textUp ? textToSVG.getSVG(textUp, options) : null;
    const svgDown = textDown ? textToSVG.getSVG(textDown, options) : null;

    const sizeSvgUp = textUp ? textToSVG.getMetrics(textUp, options) : null;
    const sizeSvgDown = textDown ? textToSVG.getMetrics(textDown, options) : null;

    let widthHeight = Math.max(sizeSvgUp?.width || 0, sizeSvgDown?.width || 0) + 50;
    widthHeight = Math.floor(widthHeight) < 512 ? 512 : Math.floor(widthHeight);
    console.log('Width/Height:', widthHeight);

    const compositeObjects = [];
    if (svgUp) {
        compositeObjects.push({ input: Buffer.from(svgUp), gravity: 'north' });
    }
    if (svgDown) {
        compositeObjects.push({ input: Buffer.from(svgDown), gravity: 'south' });
    }

    await sharp(inputImagePath)
        .resize({
            width: widthHeight,
            height: widthHeight,
            fit: (crop ? null : sharp.fit.fill),
            position: sharp.strategy.entropy
        })
        .toBuffer()
        .then(buffer => {
            return sharp(buffer).composite(compositeObjects).toFile(outputImagePath);
        })
        .then(() => {
            console.log('Imagem com texto adicionado criada com sucesso!');
        })
        .catch(err => {
            console.error('Ocorreu um erro ao adicionar texto à imagem:', err);
        });

    const outputImage = fs.readFileSync(outputImagePath);
    return outputImage.toString('base64');
}

async function resizeVideo(inputFile, force, originalAR) {
    let outputFile = `./resources/outputs/tempOutput.mp4`;
    const outputOptions = [
        '-movflags',
        'frag_keyframe+empty_moov',
        '-preset ultrafast',
    ];

    if (originalAR && !force) {
        null;
    } else if (originalAR && force) {
        outputOptions.push('-vf', 'setpts=0.4*PTS', '-r', '10');
    } else if (force) {
        outputOptions.push('-vf', 'scale=512:512,setpts=0.4*PTS', '-r', '10');
    } else {
        outputOptions.push('-vf', 'scale=512:512');
    }

    await new Promise((resolve, reject) => {
        ffmpeg(inputFile)
            .videoCodec('libx265')
            .addOutputOptions(outputOptions)
            .on('error', (err) => {
                reject('Erro ao redimensionar o vídeo:', err);
            })
            .on('end', () => {
                resolve();
            })
            .save(outputFile);
    });

    return outputFile;
}

async function handleStickerGeneration(msg, sender) {
    try {
        await msg.reply("Transformando ⏳ ...");
        await msg.react("⏳");

        const commandParts = msg.body.split(" ");
        const stickerSizeCommandIndex = commandParts.indexOf(STICKER_COMMAND);
        const resizeWidth = getSizeFromCommand(commandParts, stickerSizeCommandIndex);
        const crop = commandParts.includes('-crop');
        const force = commandParts.includes('-force');
        const originalAR = commandParts.includes('-original');

        let textUp = null;
        let textDown = null;

        const textMatch = msg.body.match(/-texto1\s(.*?)(;|$)/s);
        const textMatch2 = msg.body.match(/-texto2\s(.*?)(;|$)/s);

        if (textMatch) {
            textUp = textMatch[1].trim().toUpperCase();
        }

        if (textMatch2) {
            textDown = textMatch2[1].trim().toUpperCase();
        }

        switch (msg.type) {
            case "image":
                await handleImageStickerGeneration(msg, sender, resizeWidth, crop, textUp, textDown);
                break;
            case "video":
                await handleVideoStickerGeneration(msg, sender, force, originalAR, textUp, textDown);
                break;
            case "chat":
                await handleChatStickerGeneration(msg, sender, resizeWidth);
                break;
            default:
                msg.reply("❌ Erro, tipo de mídia não suportado!");
                msg.react("❌");
        }
    } catch (error) {
        console.error('Error generating sticker:', error.message);
        await msg.reply("❌ Erro ao gerar Sticker!");
        msg.react("❌");
    }
}

async function handleImageStickerGeneration(msg, sender, resizeWidth, crop, textUp, textDown) {
    try {
        let { data } = await msg.downloadMedia();
        if (textDown || textUp) {
            data = await addTextToImage(data, textUp, textDown, crop);
        }
        const resizedImageData = await resizeImage(data, resizeWidth, crop);
        await sendMediaSticker(sender, MediaType.Image, resizedImageData);
        await msg.reply("Sticker gerado com sucesso 😎");
        msg.react("✅");
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error generating sticker:', error.message);
            await msg.reply("❌ Erro ao gerar Sticker!");
            msg.react("❌");
        } else {
            console.error('Erro inesperado ao gerar sticker:', error);
        }
    } finally {
        try {
            fs.unlinkSync('./resources/tempInput.png');
            fs.unlinkSync('./resources/tempOutput.png');
        } catch (error) {
            console.error('Erro ao remover arquivos temporários:', error.message);
        }
    }
}

async function handleVideoStickerGeneration(msg, sender, force, originalAR, textUp, textDown) {
    if (!fs.existsSync('./resources/outputs')) {
        fs.mkdirSync('./resources/outputs');
    } else {
        fs.rmSync('./resources/outputs', { recursive: true });
        fs.mkdirSync('./resources/outputs');
    }
    try {
        const temp = await msg.downloadMedia();
        let tempPath = './resources/outputs/temp.mp4';
        fs.writeFileSync(tempPath, temp.data, 'base64');
        if (textDown || textUp) {
            data = await addTextToVideo(tempPath, textUp, textDown);
            tempPath = './resources/outputs/tempWithText.mp4';
        }
        const resizedData = await resizeVideo(tempPath, force, originalAR);
        await sendMediaStickerFromFile(msg, resizedData);
        await msg.reply("Sticker gerado com sucesso 😎");
        await msg.react("✅");
        fs.rmSync('./resources/outputs', { recursive: true });
    } catch (error) {
        console.error('Error generating video sticker:', error);
        await msg.reply("❌ Erro ao gerar Sticker de vídeo!");
        await msg.react("❌");
        fs.rmSync('./resources/outputs', { recursive: true })
    }
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

async function sendMediaSticker(sender, type, data) {
    const media = new MessageMedia(type.contentType, data, type.fileName)
    await defaultClient.sendMessage(sender, media, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerPack: "Grifo's Gallery" })
}

async function sendMediaStickerFromFile(msg, filePath) {
    const sender = msg.from;
    const media = MessageMedia.fromFilePath(filePath);
    await defaultClient.sendMessage(sender, media, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerPack: "Grifo's Gallery" });
}


async function sendMediaImage(sender, type, data) {
    const media = new MessageMedia(type.contentType, data, type.fileName);
    await defaultClient.sendMessage(sender, media);
}

function getSizeFromParam(param) {
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
        const configPath = '../config.js';
        let config = require(configPath);

        config.lastDeployTime = lastDeployTime.toISOString();

        fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};`);
        console.log('Last deploy time saved successfully.');
    } catch (error) {
        console.error('Error saving last deploy time:', error);
    }
}

function isClientMentioned(mentions, wid) {
    return mentions && mentions.some(contact => contact.id.user === wid);
}

module.exports = {
    resizeImage,
    sendMediaSticker,
    sendMediaImage,
    getSizeFromParam,
    saveLastDeployTime,
    cleanUp,
    getDefaultChromePath,
    isClientMentioned,
    handleStickerGeneration,
    initClient
}