let goodCount = require("../config").goodCount;
let badCount = require("../config").badCount;

const goodWords = [
    "obrigado",
    "valeu",
    "vlw",
    "boa",
    "boa garota",
    "te amo",
    "te adoro",
    "😘",
    "😍",
    "😊",
    "👍",
    "obrigada",
    "diva",
    "deusa",
    "rainha",
    "linda",
    "maravilhosa",
    "perfeita",
    "good bot",
    "boa garota",
]

const badWords = [
    "vai tomar no cu",
    "canalha",
    "vai se fuder",
    "vai se foder",
    "vai tomar no seu cu",
    "lixo",
    "corna",
    "vai toma no cu",
    "ta uma merda",
    "ta uma bosta",
    "inutil",
    "inútil",
    "serve pra nada",
    "não presta",
    "bad bot",
    "😡",
    "😠",
    "😒",
    "😤",
    "🤬",
    "eu te odeio",
    "eu te detesto",
    "eu te desprezo",
    "eu te abomino",
    "🖕",
    "👎",
    "duart",
    "faz o L",
    "piranha",
    "cachorra", 
    "vadia",
]

const goodReactions = ["😄", "😃", "😀", "😍", "😊", "🥰", "😻", "💖", "❤️", "🌈", "🌟", "😁", "😎", "🤗", "👍"];
const badReactions = ["😠", "😡", "😢", "😞", "😓", "😔", "😣", "😩", "😤", "😖", "😭", "💔", "👎", "😾", "😿"];



async function handleFeedback(msg) {
    const rng = () => Math.floor(Math.random() * 15);
    const contact=  await msg.getContact();
    console.log(contact)
    const nome = contact.pushname || contact.number; 

    if (goodWords.some(word => msg.body.toLowerCase().includes(word))) {
        goodCount++;
        await msg.react(goodReactions[rng()]);
        msg.reply(`Obrigado ${nome}! ${goodReactions[rng()]} `);

    } else if (badWords.some(word => msg.body.toLowerCase().includes(word))) {
        badCount++;
        await msg.react(badReactions[rng()]);
        msg.reply(`FAZ MELHOR OTÁRIO ${badReactions[rng()]} `);
        console.log(`Reclamações: ${badCount}`);
    }
}

module.exports = handleFeedback;
