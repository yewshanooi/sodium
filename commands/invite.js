const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'invite',
    description: 'Invite this bot to your own Discord Server',
    usage: 'invite',
    cooldown: '0',
    execute (message) {
        const embed = new MessageEmbed()
            .setTitle('Invite')
            .setDescription('SkyElementsBot for Discord Servers running on Discord.js v12')
            .addField('Bot Invitation Link', '[*Click Here*](https://discord.com/api/oauth2/authorize?client_id=531811937244151808&permissions=8&scope=bot%20applications.commands)')
            .addField('Official Github Repository', '[*Click Here*](https://github.com/javaruntimemc/skyelementsbot)')
            .setTimestamp()
            .setColor(embedColor);
        message.channel.send(embed);
    }
};