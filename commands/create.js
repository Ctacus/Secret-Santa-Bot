const Discord   = require('discord.js');
const { query } = require('../mysql');
const config    = require('../json/config.json');
const methods   = require('../utils/methods');

module.exports = {
    name: 'create',
    aliases: [''],
    description: 'Создает нового АДМ, к которому все могут присоединиться.',
    hasArgs: true,
    requirePartner: false,
    worksInDM: false,
    forceDMsOnly: false,
    modOnly: false,
    adminOnly: false,
    guildModsOnly: true,

    async execute(message, args, prefix) {
        const row = (await query(`SELECT * FROM users WHERE userId = ${message.author.id}`))[0];

        if (row.exchangeId !== 0) return message.reply('Вы уже участвуете в АДМ! Перед тем как создавать нового АДМ, попросите создателя существующего отменить его.');
        let deadline = args.join(' ');
        const embed = new Discord.MessageEmbed()
            .setTitle('__' + message.member.displayName + ' запустил нового Анонимного Деда Мороза!__')
            .setDescription('Нажмите 🎅 чтобы присоединиться!' +
                '\nУберите 🎅 чтобы выйти из круга!' +
                (deadline ? '\n\nЖдём всех до ' + deadline + '!' : ''))
            // .setFooter(message.member.displayName + ' может начать распределение командой ' + config.prefix + 'start') // TODO: добавить список тех, к кому можно обращаться
            .setFooter('Убедитесь, что вы разрешили приём личных сообщений от участников сервера, иначе волшебства не будет!')
            .setColor(config.embeds_color)

        const botMessage = await message.channel.send(embed);
        try {
            await botMessage.react('🎅');
        } catch (err) {
        }

        await query(`UPDATE users SET exchangeId = ${botMessage.id} WHERE userId = ${message.author.id}`);
        await addNewExchange(botMessage.id, message.author.id);
    },
}

async function addNewExchange(exchangeId, creatorId){
    await query(`INSERT IGNORE INTO exchange (
        exchangeId,
        creatorId,
        started,
        description) VALUES (
            ?, ?, 0,''
        )
    `, [exchangeId, creatorId]);
}