let goodCount = require("../config").goodCount;
let badCount = require("../config").badCount;

const goodWords = [
    "obrigado",
    "valeu",
    "vlw",
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
    "leandrinha",
    "duart",
    "yuri",
    "faz o L",
]

const goodReactions = ["😄", "😃", "😀", "😍", "😊", "🥰", "😻", "💖", "❤️", "🌈", "🌟", "😁", "😎", "🤗", "👍"];
const badReactions = ["😠", "😡", "😢", "😞", "😓", "😔", "😣", "😩", "😤", "😖", "😭", "💔", "👎", "😾", "😿"];



async function handleFeedback(msg) {
    const rng = () => Math.floor(Math.random() * 15);
    const nome = msg.getContact().pushname;
    if (goodWords.some(word => msg.body.toLowerCase().includes(word))) {
        goodCount++;
        await msg.react(goodReactions[rng()]);
        msg.reply(`Obrigado pelo carinho! ${goodReactions[rng()]}, ${nome}, já fui elogiada ${goodCount} vezes `);

    } else if (badWords.some(word => msg.body.toLowerCase().includes(word))) {
        badCount++;
        await msg.react(badReactions[rng()]);
        msg.reply(`FAZ MELHOR OTÁRIO ${badReactions[rng()]}, já fui xingada ${badCount} vezes `);
        console.log(`Reclamações: ${badCount}`);
    }
}

module.exports = handleFeedback;
