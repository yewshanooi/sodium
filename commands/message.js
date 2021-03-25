const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'message',
	description: 'Sends a private message to the user specified',
    cooldown: '10',
    usage: '{@user} {message}',
    guildOnly: true,
	execute (message, args) {
        const msg = args.splice(1).join(' ');
        const receiver = message.mentions.users.first();
        const embed = new MessageEmbed()
            .setTitle('Incoming message from')
            .setDescription(`User : \`${message.author.tag}\`\n Server : \`${message.guild.name}\`\n Message : \`${msg}\``)
            .setColor(embedColor)
            .setTimestamp();
        message.delete();
        receiver.send(embed);
	}
};