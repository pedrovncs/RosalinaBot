const { MessageMedia } = require("whatsapp-web.js");

const soundsDictionary = {
    'china': 'help.mp3',
    '🦋': 'butterfly.mp3',
};

const messageDictionary = {
    'nervoso': 'Calma, amigo',
    'calmar': 'indiferente amigo',
    'CAPS': 'Calmar, amigo, sem gritaria',
    'rosalixo': ['e tua mãe é piranha', 'e tu é um frouxo', 'falou o viado', 'e teu pai dá o rabo', ], 
    'calabreso': 'deus te perdoe por essa heresia',
};

async function handleInteraction(msg) {
    try {
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
        let response = messageDictionary[key];
        if (Array.isArray(response)) {
            const randomIndex = Math.floor(Math.random() * response.length);
            response = response[randomIndex];
        }
        await msg.reply(response);
    } catch (error) {
        console.error(`Erro ao lidar com a mensagem para a chave "${key}":`, error);
    }
}

module.exports = handleInteraction;
