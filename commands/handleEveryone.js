async function handleEveryone(sender, client, msg) {
    if (sender.endsWith('@g.us')) {
        const chat = await client.getChatById(sender);
        const botId = client.info.wid._serialized;
        const groupMembers = chat.participants
            .map(participant => participant.id._serialized)
            .filter(memberId => memberId !== botId); 

        const mentionsText = groupMembers.map(member => `@${member.replace('@c.us', '')}`).join('\n');
        const message = `CHAMANDO TODOS OS CORNOS! 🐂\n\n${mentionsText}`;

        client.sendMessage(sender, message, { mentions: groupMembers })
            .then(() => {
                msg.react('📢');
                console.log('Mensagem enviada para todos!');
            })
            .catch(err => {
                console.error('Erro ao enviar mensagem para todos:', err);
            });

    } else {
        msg.react('❌');
        msg.reply('Esse comando só pode ser usado em grupos!');
    }
}

module.exports = { handleEveryone };
