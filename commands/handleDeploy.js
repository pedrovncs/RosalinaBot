const config = require("../config");
const {lastDeployTime} = config;

async function handleDeploy(msg) {
    if (lastDeployTime) {
        const lastDeployTime = new Date(config.lastDeployTime);
        const formattedTime = `${lastDeployTime.getHours()}:${lastDeployTime.getMinutes()}:${lastDeployTime.getSeconds()}`;
        const formattedDate = `${lastDeployTime.getDate()}/${lastDeployTime.getMonth() + 1}/${lastDeployTime.getFullYear()}`;
        await msg.reply(`🕒 Último deploy em: ${formattedDate} ${formattedTime}`);
    } else {
        await msg.reply(`ℹ Ainda não houve deploy desde que o bot foi iniciado.`);
    }
    msg.react("✅");
}

module.exports = handleDeploy;
