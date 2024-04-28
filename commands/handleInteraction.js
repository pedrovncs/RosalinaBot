const { MessageMedia } = require("whatsapp-web.js");

const soundsDictionary = {
    'china': 'help.mp3',
    '🦋': 'butterfly.mp3',
};

const messageDictionary = {
    'nervoso': 'Calma, amigo',
    'calmar': 'indiferente amigo',
    'CAPS': 'Calmar, amigo, sem gritaria',
};

async function handleInteraction(msg) {
    try {
        if (await checkCaps(msg)) {
            await handleMessage(msg, 'CAPS');
        } else {
            const lowerCaseBody = msg.body.toLowerCase();
            for (const key in soundsDictionary) {
                if (lowerCaseBody.includes(key)) {
                    await handleSound(msg, key);
                }
            }
            for (const key in messageDictionary) {
                if (lowerCaseBody.includes(key)) {
                    await handleMessage(msg, key);
                }
            }
        }
    } catch (error) {
        console.error('Erro ao lidar com a interação:', error);
    }
}

async function handleSound(msg, key) {
    try {
        await msg.react("🔊");
        const media = MessageMedia.fromFilePath(`./resources/sounds/${soundsDictionary[key]}`);
        await msg.reply(media, msg.from, { sendAudioAsVoice: true });
    } catch (error) {
        console.error(`Erro ao lidar com o som para a chave "${key}":`, error);
    }
}

async function handleMessage(msg, key) {
    try {
        await msg.react("⁉");
        await msg.reply(messageDictionary[key]);
    } catch (error) {
        console.error(`Erro ao lidar com a mensagem para a chave "${key}":`, error);
    }
}

async function checkCaps(msg) {
    try {
        const message = msg.body.trim();
        const capsPercentage = (message.match(/[A-Z]/g) || []).length / message.length;
        if ((capsPercentage > 0.8) && (message.length > 16)) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao verificar maiúsculas na mensagem:', error);
        return false; 
    }
}

module.exports = handleInteraction;
