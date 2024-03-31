const { allowedIds, adminIds } = require('../config.js');
const fs = require('fs');

const addGroup = (sender, client, msg) => {
    if (adminIds.includes(msg.author)) {
        const group = msg.from;

        if (group && group.includes('@g.us')) {
            allowedIds.push(group);

            const updatedConfig = { ...require('../config.js'), allowedIds };

            fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);

            msg.react('✅');
            msg.reply(`✅ Grupo ${group} adicionado com sucesso!`);
        } else {
            msg.react('❌');
            if (!group.includes('@g.us')) {
                msg.reply(`❌ Este comando só funciona em grupos!`);
            } else if (!group) {
                msg.reply(`❌ Não foi possível identificar o grupo!`);
            }
        }
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para adicionar grupos!`);
    }
}

const addUser = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        let user = msg.body.split(' ')[1];
        user = formatId(user);

        if (user && user.includes('@g.us')) {
            allowedIds.push(user);

            const updatedConfig = { ...require('../config.js'), allowedIds };

            fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);

            msg.react('✅');
            msg.reply(`✅ Usuário ${user} adicionado com sucesso!`);
        } else {
            msg.react('❌');{
                msg.reply(`❌ Não foi possível adicionar o usuário!`);
            }
        }
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para adicionar usuários!`);
    }
}

const addAdmin = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        let user = msg.body.split(' ')[1];
        user = formatId(user);

        if (user && user.includes('@g.us')) {
            adminIds.push(user);

            const updatedConfig = { ...require('../config.js'), adminIds };

            fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);

            msg.react('✅');
            msg.reply(`✅ Usuário ${user} adicionado com sucesso!`);
        } else {
            msg.react('❌');{
                msg.reply(`❌ Não foi possível adicionar o usuário!`);
            }
        }
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para adicionar Admins!`);
    }
}

function formatId(contact) {
    contact.push('@c.us');
    return contact
}

module.exports = { addGroup };
