const { Client, LocalAuth } = require('whatsapp-web.js');
const { cleanUp, saveLastDeployTime, getDefaultChromePath, isClientMentioned, initClient } = require('./utils');
const { handleAjuda } = require('./commands/handleAjuda');
const qrcode = require('qrcode-terminal');
const { allowedIds, adminIds } = require('./config');
const { Commands } = require('./constants');
const handleEsmola = require('./commands/handleEsmola');
const handleDeploy = require('./commands/handleDeploy');
const handlePing = require('./commands/handlePing');
const { addGroup, handleAjudaAdmin } = require('./commands/handleAdmin');
const handleStickerCommand = require('./commands/handleStickerCommand');
const { handleAnswer, handleCompliment } = require('./commands/handleFeedback');
const {handleDevkit} = require('./commands/handleDevkit');

let flagLimpo = false;
const cleanTime = 5000;

const puppeteerdata = getDefaultChromePath() ? { executablePath: getDefaultChromePath(), args: ['--no-sandbox,'] } : {};
const ffmpegPath = require('ffmpeg-static');

const client = new Client({
    authStrategy: new LocalAuth(),
    ffmpegPath: ffmpegPath,
    puppeteer: puppeteerdata,
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html',
   }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    initClient(client);
    flagLimpo = cleanUp(cleanTime); 
    flagLimpo = true;
    saveLastDeployTime(new Date());
    setTimeout(() => {
        client.sendMessage(adminIds[0], `-Novo deploy! 🚀 `);
    }, cleanTime + 1000);
    console.log('Rosalina rodando!');
});

client.on('message', async msg => {
    if (flagLimpo) {
        const lowerCaseBody = msg.body.toLowerCase(); 
        console.log(`Mensagem recebida de: ${msg.from}, Autorizado: ${ allowedIds.includes(msg.from) || adminIds.includes(msg.from) }`)
        if (allowedIds.includes(msg.from) || allowedIds.length === 0 || adminIds.includes(msg.from) || adminIds.includes(msg.author)) {
            const sender = msg.from.startsWith(client.info.wid.user) ? msg.to : msg.from;
            if (lowerCaseBody.split(" ").includes(Commands.STICKER_COMMAND)) {
                handleStickerCommand(sender, client, msg);
            } else if (lowerCaseBody === Commands.PING_COMMAND) {
                handlePing(sender, client, msg);
            } else if (lowerCaseBody === Commands.AJUDA_COMMAND) {
                handleAjuda(sender, client, msg);
            } else if (lowerCaseBody === Commands.ESMOLA_COMMAND) {
                handleEsmola(sender, client, msg);
            } else if (lowerCaseBody === Commands.LAST_DEPLOY_COMMAND) {
                handleDeploy(msg);
            }else if (lowerCaseBody.includes('/templates')){
                handleDevkit(sender, client, msg);
            } else if(lowerCaseBody.includes('/addgroup')){
                addGroup(sender, client, msg);
            } else if( lowerCaseBody.includes('/ajudaadmin')){
                handleAjudaAdmin(sender, client, msg);
            }
            else if (lowerCaseBody.includes('rosalina')) {
                if (lowerCaseBody.includes("?")){
                    handleAnswer(client,msg);
                } else {
                    handleCompliment(msg);
                }
                
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
