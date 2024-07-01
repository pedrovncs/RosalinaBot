const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

const goodWords = require('../config').goodWords;
const badWords = require('../config').badWords;
const goodReactions = require('../config').goodReactions;
const badReactions = require('../config').badReactions;


const rareStickersDir = './resources/Answers/rares';
const answerStickersDir = './resources/Answers';

let rareStickers = [];
let answerStickers = [];

function loadStickers(directory) {
    return fs.readdirSync(directory)
      .filter(file => path.extname(file).toLowerCase() === '.png')
      .map(file => file); 
  }

rareStickers = loadStickers(rareStickersDir, "png");
answerStickers = loadStickers(answerStickersDir, "png");


async function handleFeedback(msg) {
    const lowerCaseBody = msg.body.toLowerCase(); 
    if (lowerCaseBody.includes("?")){
        handleAnswer(msg);
    } else {
        handleCompliment(msg);
    }
}

let rareChance = 0.04;
let lastSticker = ""
async function handleAnswer(msg) {
    let rng = Math.floor(Math.random() * answerStickers.length);
    {answerStickers[rng] === lastSticker ? rng = Math.floor(Math.random() * answerStickers.length) : lastSticker = answerStickers[rng]}
    console.log(rareChance);
    const isRare = Math.random() < rareChance;
    console.log(isRare);

    if (isRare) {
        rareChance = 0.04;
        let rng = Math.floor(Math.random() * rareStickers.length);
        {rareStickers[rng] === lastSticker ? rng = Math.floor(Math.random() * rareStickers.length) : lastSticker = rareStickers[rng]}
        const media = MessageMedia.fromFilePath(`./resources/Answers/rares/${rareStickers[rng]}`);
        await msg.react("⁉");
        await msg.reply(media, msg.sender, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerName: "Grifo's Gallery" });
    } else {
        rareChance += 0.02;
        const media = MessageMedia.fromFilePath(`./resources/Answers/${answerStickers[rng]}`);
        await msg.react("⁉")
        await msg.reply(media, msg.sender, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerName: "Grifo's Gallery" });
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