const { MessageMedia } = require('whatsapp-web.js');

const goodWords = require('../config').goodWords;
const badWords = require('../config').badWords;


const goodReactions = ["😄", "😃", "😀", "😍", "😊", "🥰", "😻", "💖", "❤️", "🌈", "🌟", "😁", "😎", "🤗", "👍"];
const badReactions = ["😠", "😡", "😒", '👿', "💢", "😤", "😾", "🤬", "😣", "😖", "😑"];

const answerStickers = ["god_is_dead.png", "idk.png", "mayber.png", "nope.png", "nope.png", "yes.png", "yes.png", "you_know.png", "wtf.png", "sure.png", "no_answer.png", "omg.png"];
const rareStickers = ["42.png", "brian_jonestown_massacre.png", "smell_it.png", "introvert.png", "morpheus.png"]

async function handleFeedback(msg) {
    const lowerCaseBody = msg.body.toLowerCase(); 
    if (lowerCaseBody.includes("?")){
        handleAnswer(msg);
    } else {
        handleCompliment(msg);
    }
}

async function handleAnswer(msg) {
    const rng = Math.floor(Math.random() * answerStickers.length);
    const rareChance = 0.013;
    const isRare = Math.random() < rareChance;

    if (isRare) {
        const rng = Math.floor(Math.random() * rareStickers.length);
        const media = MessageMedia.fromFilePath(`./resources/Answers/rares/${rareStickers[rng]}`);
        await msg.react("⁉");
        await msg.reply(media, msg.sender, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerPack: "Grifo's Gallery" });
    } else {
        const media = MessageMedia.fromFilePath(`./resources/Answers/${answerStickers[rng]}`);
        await msg.react("⁉")
        await msg.reply(media, msg.sender, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerPack: "Grifo's Gallery" });
    }
}


async function handleCompliment(msg) {
    const rngGood =  Math.floor(Math.random() * goodReactions.length);
    const rngBad =  Math.floor(Math.random() * badReactions.length);

    const contact = await msg.getContact();
    const nome = contact.pushname || contact.number;

    if (goodWords.some(word => msg.body.toLowerCase().includes(word))) {
        await msg.react(goodReactions[rngGood]);
        msg.reply(`Fico feliz ${nome}! ${goodReactions[rngGood]} `);
    } else if (badWords.some(word => msg.body.toLowerCase().includes(word))) {
        await msg.react(badReactions[rngBad]);
        msg.reply(`FAZ MELHOR OTÁRIO ${badReactions[rngBad]} `);
    }
}

module.exports = {
    handleFeedback
} 