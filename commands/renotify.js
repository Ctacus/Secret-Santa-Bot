const Discord   = require('discord.js');
const { query } = require('../mysql');
const config    = require('../json/config.json');
const methods   = require('../utils/methods');

module.exports = {
    name: 'renotify',
    aliases: ['remind'],
    description: 'Напоминает участникам, кому они дарят подарки!',
    hasArgs: true,
    requirePartner: false,
    worksInDM: true,
    forceDMsOnly: false,
    modOnly: false,
    adminOnly: true,

    execute: async function (message, args, prefix) {
        const row = (await query(`SELECT * FROM users WHERE userId = ${message.author.id}`))[0];
        const exchangeRow = (await query(`SELECT * FROM users INNER JOIN exchange ON users.exchangeId = exchange.exchangeId WHERE userId = ${message.author.id}`))[0];

        if (row.exchangeId === 0) return message.reply('Вы не участвуете в АДМ.');

        if (!exchangeRow || exchangeRow.started === 0) return message.reply('АДМ еще не начался!');

        if (!args.length || ['all', 'missed'].indexOf(args[0].toLowerCase()) < 0)
            return message.reply('Укажите параметр `missed`, чтобы уведомить тех, кто пропустил первое сообщение, либо `all`, чтобы заново напомнить всем об ответственности.');


        const rows = (await query(`SELECT * FROM users WHERE exchangeId = ${row.exchangeId}`
            + (args[0] === 'all' ? `` : ` and notified = 0`)));
        rows.forEach(userRow => {
            const partnerInfo = query(`SELECT * FROM users WHERE userId = ${userRow.partnerId}`);
            const userId = userRow.userId;
            const user = message.client.users.fetch(userId);
            const notifyEmbed = new Discord.MessageEmbed()
                .setTitle('__Анонимный Дед Мороз всё ещё идёт!__')
                .setDescription('Напоминаем, что вы были выбраны в качестве Деда Мороза для: <@' + userRow.partnerId + '> 🎄'
                    + (!partnerInfo.wishlist ? '' : '\n\nВот пожелания:\n```' + partnerInfo.wishlist + '```') +
                    '\n\nВы можете отправить им анонимное сообщение командой `' + prefix + 'message получатель <сообщение>`')
                .setFooter('Если вместо имени вы видите `@invalid-user`, то попробуйте просмотреть это сообщение с компьютера!')
                .setColor(config.embeds_color)

            user.then(u => u.send(notifyEmbed).then(
                ok => query(`UPDATE users SET notified = 1 WHERE userId = ${userId}`),
                notOk => message.reply(`Кажется у участника <@${userId}> всё ещё закрыты личные сообщения (${notOk})!`)
            ));
        })

    },
}

