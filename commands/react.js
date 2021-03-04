const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'react',
    description: 'Reacts then reply to your message',
    execute (message) {
        message.react('😄');
        const embed = new MessageEmbed()
            .setTitle('Hey there!')
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
    }
};