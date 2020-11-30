const Discord     = require('discord.js');
const { version } = require('../package.json');
const os          = require('os');
const config      = require('../json/config.json');

module.exports = {
    name: 'rules',
    aliases: [''],
    description: 'Отображает правила.',
    hasArgs: false,
    requirePartner: false,
    worksInDM: true,
    forceDMsOnly: false,
    modOnly: false,
    adminOnly: false,

    async execute(message, args, prefix){
        //TODO: make rules configurable!
        var rules  =
            'Правила: \n' +
            ' - лимит стоимости: 1000р\n' +
            ' - дата вручения подарков: 25.12.2020\n' +
            ' - старайтесь избегать прямых вопросов: "Я твой Дед Мороз, что тебе подарить?!"\n' +
            ' - допускается самодеанонимизация путем вкладывания послания в подарок\n' +
            ' - подарок не должен содержать радиоактивные отходы и/или боевые нейротоксины'

        // const embedInfo = new Discord.MessageEmbed()
        // embedInfo.setTitle(`**Правила**`)
        // embedInfo.setColor(config.embeds_color)
        // embedInfo.setDescription('```' + rules + '```')
        // message.channel.send(embedInfo);
        message.channel.send('```' + rules + '```');
    },
}