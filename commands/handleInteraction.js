const { MessageMedia } = require("whatsapp-web.js");

const soundsDictionary = require("../config").soundsDictionary;
const messageDictionary = require("../config").messageDictionary;

async function handleInteraction(msg) {
    try {
            if (msg.body.includes("/burro")) {
                await paraDeSerBurro(msg);
            }
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

async function paraDeSerBurro(msg){
    const prefix = "/burro"
    nome = msg.body.slice(prefix.length).trim();
    try {
        await msg.react("🤔");
        await msg.reply(`Tem que parar de ser burro ${"`"}${nome}${"`"}, isso sim. Tem que parar de mamar as bolas dele quando nem ao menos ele nem sabe quem você é, vc só é uma ferramenta nada a mais, tá tentando se fazer de inteligente mas não tá só tá parecendo uma piada pra todo mundo`);
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
