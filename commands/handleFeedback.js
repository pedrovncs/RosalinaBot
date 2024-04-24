const { MessageMedia } = require('whatsapp-web.js');
const { sendMediaSticker } = require('../utils');

const goodWords = require('../config').goodWords;
const badWords = require('../config').badWords;


const goodReactions = ["😄", "😃", "😀", "😍", "😊", "🥰", "😻", "💖", "❤️", "🌈", "🌟", "😁", "😎", "🤗", "👍"];
const badReactions = ["😠", "😡", "😒", '👿', "💢", "😤", "😾", "🤬", "😣", "😖", "😑"];

const answerStickers = ["god_is_dead.png", "idk.png", "mayber.png", "nope.png", "nope.png", "yes.png","yes.png",,"you_know.png", "wtf.png", "sure.png", "no_answer.png", "omg.png" ];
const rareStickers = ["42.png", "brian_jonestown_massacre.png", "smell_it.png", "introvert.png", "morpheus.png"]

async function handleAnswer(client, msg) {
    const rng = () => Math.floor(Math.random() * answerStickers.length);
    const rngRare = () => Math.floor(Math.random() * 1000);
    if (rngRare % rng === 0) {
        const rng = () => Math.floor(Math.random() * rareStickers.length);
        const media = MessageMedia.fromFilePath(`./resources/Answers/rares/${rareStickers[rng()]}`);
        await msg.react("⁉");
        await msg.reply(media, msg.sender, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerPack: "Grifo's Gallery" });
    } else {
        const media = MessageMedia.fromFilePath(`./resources/Answers/${answerStickers[rng()]}`);
        await msg.react("⁉")
        await msg.reply(media, msg.sender, { sendMediaAsSticker: true, stickerAuthor: "Rosalina", stickerPack: "Grifo's Gallery" });
    }
}

async function handleCompliment(msg) {
    const rng = () => Math.floor(Math.random() * 15);
    const contact=  await msg.getContact();
    const nome = contact.pushname || contact.number; 
    if (goodWords.some(word => msg.body.toLowerCase().includes(word))) {
        await msg.react(goodReactions[rng()]);
        msg.reply(`Obrigado ${nome}! ${goodReactions[rng()]} `);
    } else if (badWords.some(word => msg.body.toLowerCase().includes(word))) {
        await msg.react(badReactions[rng()]);
        msg.reply(`FAZ MELHOR OTÁRIO ${badReactions[rng()]} `);
    }
}

module.exports ={
    handleAnswer,
    handleCompliment
} 