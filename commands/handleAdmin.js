const { allowedIds, adminIds } = require('../config.js');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

async function handleAdmin(msg, client) {
    const prefix = '/admin '; 
    const lowerCaseBody = msg.body.toLowerCase(); 
    if (lowerCaseBody.startsWith(prefix)) {
        const command = lowerCaseBody.slice(prefix.length).trim().split(' ')[0];
        if (adminIds.includes(msg.author) || adminIds.includes(msg.from)) {
            if (adminCommands[command]) {
                adminCommands[command](msg);
            } else {
                await msg.react('❌');
                await msg.reply(`❌ Comando ${command} não encontrado!`);
            }
        } else {
            await msg.react('❌');
            await msg.reply(`❌ Você não tem permissão para acessar este comando!`);
        }
    }
}

async function configBackup(msg) {
    const config = require('../config.js');
    const configBackupPath = './resources/config.js';
    fs.writeFileSync(configBackupPath, JSON.stringify(config, null, 2));
    const media = MessageMedia.fromFilePath(configBackupPath);
    msg.reply(media, msg.from, { sendMediaAsDocument: true, caption: 'config module.' });
    return;
}

const addGroup = (msg) => {
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
}

const addUser = (msg) => {
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
            msg.react('❌'); {
                msg.reply(`❌ Não foi possível adicionar o usuário!`);
            }
    } 
}

const addAdmin = (msg) => {
        let user = msg.body.split(' ')[1];
        user = formatId(user);
        if (user && user.includes('@g.us')) {
            adminIds.push(user);
            const updatedConfig = { ...require('../config.js'), adminIds };
            fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);
            msg.react('✅');
            msg.reply(`✅ Usuário ${user} adicionado com sucesso!`);
        } else {
            msg.react('❌'); {
                msg.reply(`❌ Não foi possível adicionar o usuário!`);
            }
        }
    } 

const listAllowed = (msg) => {
        msg.react('✅');
        msg.reply(`✅ Lista de grupos autorizados: ${allowedIds.join(', \n')}`);
}

const listAdmins = (msg) => {
        msg.react('✅');
        msg.reply(`✅ Lista de Admins: ${adminIds.join(', \n')}`);
}

const removeGroup = (msg) => {
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
    } 


const removeUser = (msg) => {
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
    } 

const addBadWords = (msg) => {
        const prefix = '/admin addbadwords ';
        const message = msg.body.toLowerCase();
        const words = message.slice(prefix.length).split(';').map(word => word.trim());
        const updatedConfig = { ...require('../config.js') };
        updatedConfig.badWords = [...updatedConfig.badWords, ...words];
        fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);
        msg.react('✅');
        msg.reply(`✅ Palavras adicionadas com sucesso!`);
}

const addGoodWords = (msg) => {
    const prefix = '/admin addgoodwords ';
    // Convert the message to lowercase and trim it
    let message = msg.body.toLowerCase().trim();
    
    // Remove the prefix and any trailing whitespace or semicolon
    let words = message.slice(prefix.length).replace(/;$/, '').trim();
    
    if (words) {
        const updatedConfig = { ...require('../config.js') };
        const wordsArray = words.split(';').map(word => word.trim());
        updatedConfig.goodWords = [...updatedConfig.goodWords, ...wordsArray];
        fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);
        msg.react('✅');
        msg.reply(`✅ ${wordsArray.length} palavra(s) adicionada(s) com sucesso!`);
    } else {
        msg.react('❌');
        msg.reply('❌ Nenhuma palavra válida foi fornecida.');
    }
};

const removeBadWords = (msg) => {
        const words = msg.body.split(' ').slice(1).join(' ').split(';').map(word => word.trim());
        const updatedConfig = { ...require('../config.js') };
        updatedConfig.badWords = updatedConfig.badWords.filter(word => !words.includes(word));
        fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);
        msg.react('✅');
        msg.reply(`✅ ${words.length} removidas com sucesso!`);
    } 

const removeGoodWords = (msg) => {
        const words = msg.body.split(' ').slice(1).join(' ').split(';').map(word => word.trim());
        const updatedConfig = { ...require('../config.js') };
        updatedConfig.goodWords = updatedConfig.goodWords.filter(word => !words.includes(word));
        fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(updatedConfig, null, 2)};`);
        msg.react('✅');
        msg.reply(`✅ Palavras removidas com sucesso!`);
}

const listBadWords = (msg) => {
        msg.react('✅');
        msg.reply(`✅ Lista de palavras bloqueadas: ${require('../config.js').badWords.join(', \n')}`); 
}

const listGoodWords = (msg) => {
        msg.react('✅');
        msg.reply(`✅ Lista de palavras permitidas: ${require('../config.js').goodWords.join(', \n')}`);
    } 

const handleAjudaAdmin = (msg) => {
    const ajudaAdminTextPath = './resources/ajudaAdmin.txt';
    const ajudaAdminText = fs.readFileSync(ajudaAdminTextPath, 'utf8');
    msg.react('🤔');
    msg.reply(ajudaAdminText);
}

function formatId(contact) {
    contact.push('@c.us');
    return contact
}

const adminCommands = {
    'addgroup': addGroup,
    'adduser': addUser,
    'addadmin': addAdmin,
    'listallowed': listAllowed,
    'listadmins': listAdmins,
    'removegroup': removeGroup,
    'removeuser': removeUser,
    'addbadwords': addBadWords,
    'addgoodwords': addGoodWords,
    'removebadwords': removeBadWords,
    'removegoodwords': removeGoodWords,
    'listbadwords': listBadWords,
    'listgoodwords': listGoodWords,
    'configbackup': configBackup,
    'backupconfig': configBackup,
    'ajuda': handleAjudaAdmin,
}

module.exports = {
    handleAdmin,
};

