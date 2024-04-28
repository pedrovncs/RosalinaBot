async function handlePing(sender,client, msg) {
    const startTimestamp = msg.timestamp * 1000; 
    msg.react("🏓");
    msg.reply(`pong 🏓`);
    const endTimestamp = new Date().getTime(); 
    const elapsedMilliseconds = endTimestamp - startTimestamp; 
    client.sendMessage(sender, `${elapsedMilliseconds}ms`);
}

module.exports = handlePing;
