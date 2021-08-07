const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'invite',
    description: 'Get helpful links and invite the bot to your own server',
    usage: 'invite',
    cooldown: '0',
    execute (message) {
        const embed = new MessageEmbed()
            .setTitle('Invite')
            .setDescription('Website - [*weebly.com*](https://skyebot.weebly.com)\n Code Repository - [*github.com*](https://github.com/yewshanooi/skye)')
            .addField('Invite me!', '[*discord.com*](https://discord.com/api/oauth2/authorize?client_id=531811937244151808&permissions=8&scope=bot%20applications.commands)')
            .setColor(embedColor);
        message.channel.send(embed);
    }
};