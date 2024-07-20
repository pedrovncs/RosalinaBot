const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

const goodWords = require('../config').goodWords;
const badWords = require('../config').badWords;
const goodReactions = require('../config').goodReactions;
const badReactions = require('../config').badReactions;
const timeCompliments = require('../config').timeCompliments;

const rareStickersDir = './resources/Answers/rares';
const answerStickersDir = './resources/Answers';

let rareStickers = [];
let answerStickers = [];

function loadStickers(directory) {
    return fs.readdirSync(directory)
      .filter(file => path.extname(file).toLowerCase() === '.png')
      .map(file => file); 
}

rareStickers = loadStickers(rareStickersDir);
answerStickers = loadStickers(answerStickersDir);

async function handleFeedback(msg) {
    const lowerCaseBody = msg.body.toLowerCase(); 

    const isTimeCompliment = timeCompliments.morning.concat(timeCompliments.afternoon, timeCompliments.night)
        .some(phrase => lowerCaseBody.includes(phrase));

    if (isTimeCompliment) {
        await handleTimeCompliments(msg);
    } else if (lowerCaseBody.includes("?")) {
        await handleAnswer(msg);
    } else {
        await handleCompliment(msg);
    }
}

let rareChance = 0.03;
let lastSticker = "";

async function handleAnswer(msg) {
    let rng = Math.floor(Math.random() * answerStickers.length);
    if (answerStickers[rng] === lastSticker) {
        rng = Math.floor(Math.random() * answerStickers.length);
    } else {
        lastSticker = answerStickers[rng];
    }

    const isRare = Math.random() < rareChance;
    if (isRare) {
        rareChance = 0.03;
        rng = Math.floor(Math.random() * rareStickers.length);
        if (rareStickers[rng] === lastSticker) {
            rng = Math.floor(Math.random() * rareStickers.length);
        } else {
            lastSticker = rareStickers[rng];
        }
        const media = MessageMedia.fromFilePath(`./resources/Answers/rares/${rareStickers[rng]}`);
        await msg.react("⁉");
        await msg.reply(media, msg.sender, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerName: "Grifo's Gallery" });
    } else {
        rareChance += 0.017;
        const media = MessageMedia.fromFilePath(`./resources/Answers/${answerStickers[rng]}`);
        await msg.react("⁉");
        await msg.reply(media, msg.sender, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerName: "Grifo's Gallery" });
    }
}

async function handleCompliment(msg) {
    const rngGood = Math.floor(Math.random() * goodReactions.length);
    const rngBad = Math.floor(Math.random() * badReactions.length);

    const contact = await msg.getContact();
    const nome = contact.pushname || contact.number;

    const messageWords = msg.body.toLowerCase().split(/\s+/);
    const filteredWords = messageWords.filter(word => word !== 'rosalina');
    const filteredPhrase = filteredWords.join(' ');

    const isGoodMessage = goodWords.includes(filteredPhrase);
    const isBadMessage = badWords.includes(filteredPhrase);

    if (isGoodMessage) {
        await msg.react(goodReactions[rngGood]);
        msg.reply(`Obrigada ${nome}! ${goodReactions[rngGood]}`);
    } else if (isBadMessage) {
        await msg.react(badReactions[rngBad]);
        msg.reply(`FAZ MELHOR OTÁRIO ${badReactions[rngBad]}`);
    }
}

async function handleTimeCompliments(msg) {
    const dayTime = getDayTime();
    const dayTimePhrase = dayTime === 'morning' ? 'manhã' : dayTime === 'afternoon' ? 'tarde' : 'noite';
    const emote = dayTime === 'morning' ? '☀️' : dayTime === 'afternoon' ? '🌤️' : '🌙';

    const contact = await msg.getContact();
    const nome = contact.pushname || contact.number;

    const bodyCleaned = msg.body.toLowerCase().replace(/rosalina/g, '').trim();

    console.log('Cleaned Message:', bodyCleaned);

    const findTriggerPhrase = (phrases) => {
        return phrases.find(phrase => bodyCleaned.includes(phrase));
    };

    const triggerMorningPhrase = findTriggerPhrase(timeCompliments.morning);
    const triggerAfternoonPhrase = findTriggerPhrase(timeCompliments.afternoon);
    const triggerNightPhrase = findTriggerPhrase(timeCompliments.night);

    console.log('Trigger Morning Phrase:', triggerMorningPhrase);
    console.log('Trigger Afternoon Phrase:', triggerAfternoonPhrase);
    console.log('Trigger Night Phrase:', triggerNightPhrase);

    const isCorrectTimeOfDay = 
        (dayTime === 'morning' && triggerMorningPhrase) ||
        (dayTime === 'afternoon' && triggerAfternoonPhrase) ||
        (dayTime === 'night' && triggerNightPhrase);

    if (isCorrectTimeOfDay) {
        const triggerPhrase = dayTime === 'morning' ? triggerMorningPhrase :
                              dayTime === 'afternoon' ? triggerAfternoonPhrase :
                              triggerNightPhrase;
        msg.reply(`${triggerPhrase}, ${nome}! ${emote}`);
    } else {
        const customizedMessage = `Tá doido ${nome}? Tamo de ${dayTimePhrase}.`;
        msg.reply(customizedMessage);
    }
}

function getDayTime() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return 'morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        return 'afternoon';
    } else {
        return 'night';
    }
}


function getDayTime() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return 'morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        return 'afternoon';
    } else {
        return 'night';
    }
}



module.exports = {
    handleFeedback
};
