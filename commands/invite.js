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
            .addField('Bot Invitation Link', '[*discord.com*](https://discord.com/api/oauth2/authorize?client_id=531811937244151808&permissions=8&scope=bot%20applications.commands)')
            .addField('Official Github Repository', '[*github.com*](https://github.com/javaruntimemc/skyelementsbot)')
            .addField('Official Website', '[*weebly.com*](https://skyelements.weebly.com)')
            .setTimestamp()
            .setColor(embedColor);
        message.channel.send(embed);
    }
};