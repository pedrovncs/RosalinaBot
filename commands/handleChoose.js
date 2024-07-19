const { Commands } = require('../constants');

async function handleChoose(sender, client, msg) {
    const prefix = Commands.ESCOLHA_COMMAND;
    const lowerCaseBody = msg.body.replace(prefix, "").trim();
    const options = lowerCaseBody.split(' ou ');
    options.forEach((option, index) => {
        options[index] = option.trim();
    });

    if (options.length < 2) {
        await msg.react("❌");
        await msg.reply("Você precisa fornecer pelo menos duas opções separadas por ` ou  `.");
    } else {

    const chosenOption = options[Math.floor(Math.random() * options.length)];

    await msg.react("🏵️");
    await msg.reply(`Eu escolho: ${"`"}${chosenOption}${"`"}`);
    }
}
module.exports = { handleChoose }