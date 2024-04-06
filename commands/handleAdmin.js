const { allowedIds, adminIds } = require('../config.js');
const fs = require('fs');

const addGroup = (sender, client, msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        const group = msg.from;
        if (allowedIds.includes(group)) {
            msg.react('❌');
            msg.reply(`❌ Grupo ${group} já está na lista de autorizados!`);
            return;
        }

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
        if (allowedIds.includes(user)) {
            msg.react('❌');
            msg.reply(`❌ Usuário ${user} já está na lista de autorizados!`);
            return;
        }

        if (user) {
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

const listAllowed = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        msg.react('✅');
        msg.reply(`✅ Lista de grupos autorizados: ${allowedIds.join(', ')}`);
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para listar grupos autorizados!`);
    }
}

const listAdmins = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        msg.react('✅');
        msg.reply(`✅ Lista de Admins: ${adminIds.join(', ')}`);
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para listar Admins!`);
    }
}

const removeGroup = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        const group = msg.body.split(' ')[1];
        if (allowedIds.includes(group)) {
            allowedIds.splice(allowedIds.indexOf(group), 1);

            const updatedConfig = { ...require('../config.js'), allowedIds };

            fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);

            msg.react('✅');
            msg.reply(`✅ Grupo ${group} removido com sucesso!`);
        } else {
            msg.react('❌');
            msg.reply(`❌ Grupo ${group} não está na lista de autorizados!`);
        }
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para remover grupos!`);
    }

}

const removeUser = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        let user = msg.body.split(' ')[1];
        user = formatId(user);
        if (allowedIds.includes(user)) {
            allowedIds.splice(allowedIds.indexOf(user), 1);

            const updatedConfig = { ...require('../config.js'), allowedIds };

            fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);

            msg.react('✅');
            msg.reply(`✅ Usuário ${user} removido com sucesso!`);
        } else {
            msg.react('❌');
            msg.reply(`❌ Usuário ${user} não está na lista de autorizados!`);
        }
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para remover usuários!`);
    }


}

const addBadWords = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        const words = msg.body.split(' ').slice(1).join(' ').split(';').map(word => word.trim());
        const updatedConfig = { ...require('../config.js') };

        updatedConfig.badWords = [...updatedConfig.badWords, ...words];

        fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);

        msg.react('✅');
        msg.reply(`✅ Palavras adicionadas com sucesso!`);
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para adicionar palavras!`);
    }
}

const addGoodWords = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        const words = msg.body.split(' ').slice(1).join(' ').split(';').map(word => word.trim());
        const updatedConfig = { ...require('../config.js') };

        updatedConfig.goodWords = [...updatedConfig.goodWords, ...words];

        fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);

        msg.react('✅');
        msg.reply(`✅ Palavras adicionadas com sucesso!`);
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para adicionar palavras!`);
    }
}

const removeBadWords = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        const words = msg.body.split(' ').slice(1).join(' ').split(';').map(word => word.trim());
        const updatedConfig = { ...require('../config.js') };

        updatedConfig.badWords = updatedConfig.badWords.filter(word => !words.includes(word));

        fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);

        msg.react('✅');
        msg.reply(`✅ Palavras removidas com sucesso!`);
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para remover palavras!`);
    }
}

const removeGoodWords = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        const words = msg.body.split(' ').slice(1).join(' ').split(';').map(word => word.trim());
        const updatedConfig = { ...require('../config.js') };

        updatedConfig.goodWords = updatedConfig.goodWords.filter(word => !words.includes(word));

        fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);

        msg.react('✅');
        msg.reply(`✅ Palavras removidas com sucesso!`);
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para remover palavras!`);
    }
}

const listBadWords = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        msg.react('✅');
        msg.reply(`✅ Lista de palavras bloqueadas: ${require('../config.js').badWords.join(', ')}`);
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para listar palavras bloqueadas!`);
    }
}

const listGoodWords = (msg) => {
    if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
        msg.react('✅');
        msg.reply(`✅ Lista de palavras permitidas: ${require('../config.js').goodWords.join(', ')}`);
    } else {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para listar palavras permitidas!`);
    }

}

const handleAjudaAdmin = (sender, client,msg) => {
    if (!adminIds.includes(sender)) {
        msg.react('❌');
        msg.reply(`❌ Você não tem permissão para acessar este comando!`);
        return;
    }
    const ajudaAdminTextPath = './resources/ajudaAdmin.txt';
    const ajudaAdminText = fs.readFileSync(ajudaAdminTextPath, 'utf8');
    msg.react('🤔');
    client.sendMessage(sender, ajudaAdminText);
}





function formatId(contact) {
    contact.push('@c.us');
    return contact
}

module.exports = { 
    addGroup ,
    handleAjudaAdmin,
};

