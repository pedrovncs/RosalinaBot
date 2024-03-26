const goodWords = require('../config').goodWords;
const badWords = require('../config').badWords;


const goodReactions = ["😄", "😃", "😀", "😍", "😊", "🥰", "😻", "💖", "❤️", "🌈", "🌟", "😁", "😎", "🤗", "👍"];
const badReactions = ["😠", "😡", "😒", '👿', "💢", "😤", "😾", "🤬", "😣", "😖", "😑"];




async function handleFeedback(msg) {
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

module.exports = handleFeedback;
