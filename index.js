const { Client, LocalAuth } = require('whatsapp-web.js');
const { cleanUp, saveLastDeployTime, getDefaultChromePath, isClientMentioned } = require('./utils');
const { handleAjuda } = require('./commands/handleAjuda');
const qrcode = require('qrcode-terminal');
const { allowedIds, adminIds } = require('./config');
const { Commands } = require('./constants');
const handleEsmola = require('./commands/handleEsmola');
const handleDeploy = require('./commands/handleDeploy');
const handlePing = require('./commands/handlePing');
const handleSticker = require('./commands/handleSticker');
const handleStickerCommand = require('./commands/handleStickerCommand');
const handleFeedback = require('./commands/handleFeedback');

let flagLimpo = false;

const puppeteerdata = getDefaultChromePath() ? { executablePath: getDefaultChromePath(), args: ['--no-sandbox,'] } : {};
const ffmpegPath = require('ffmpeg-static');

const client = new Client({
    authStrategy: new LocalAuth(),
    ffmpegPath: ffmpegPath,
    puppeteer: puppeteerdata,
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    flagLimpo = cleanUp(client);
    saveLastDeployTime(new Date());
    setTimeout(() => {
        client.sendMessage(adminIds[0], `-Novo deploy! 🚀 `);
    }, 5000);
    console.log('Rosalina rodando!');
});

client.on('message', async msg => {
    if (flagLimpo) {
        if (allowedIds.includes(msg.from) || allowedIds.length === 0 || adminIds.includes(msg.from)) {
            const sender = msg.from.startsWith(client.info.wid.user) ? msg.to : msg.from;
            const mentions = await msg.getMentions();
            console.log(`Mensagem recebida de ${sender}`)
            if (msg.body.split(" ").includes(Commands.STICKER_COMMAND)) {
                handleStickerCommand(sender, client, msg);
            } else if (msg.body === Commands.PING_COMMAND) {
                handlePing(sender, client, msg);
            } else if (msg.body === Commands.AJUDA_COMMAND) {
                handleAjuda(sender, client, msg);
            } else if (msg.body === Commands.ESMOLA_COMMAND) {
                handleEsmola(sender, client, msg);
            } else if (msg.body === Commands.LAST_DEPLOY_COMMAND) {
                handleDeploy(msg);
            } else if (msg.type === 'sticker') {
                handleSticker(sender, client, msg);
            } 
            else{
                null
            }
        } else {
            msg.react("❌");
            return;
        }
    }
    if (isClientMentioned(await msg.getMentions(), client.info.wid.user)) {
        handleFeedback(msg);
    }
});

client.initialize();
