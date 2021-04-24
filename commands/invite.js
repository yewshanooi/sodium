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
            .setDescription('Website - [*weebly.com*](https://skyelements.weebly.com)\n Code Repository - [*github.com*](https://github.com/javaruntime/skybot)')
            .addField('Invite me!', '[*discord.com*](https://discord.com/api/oauth2/authorize?client_id=531811937244151808&permissions=8&scope=bot%20applications.commands)')
            .setColor(embedColor);
        message.channel.send(embed);
    }
};