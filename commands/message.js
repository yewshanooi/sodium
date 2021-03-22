const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'message',
	description: 'Sends a private message to the user specified',
    cooldown: '10',
    usage: '{@user} {message}',
	execute (message, args) {
        const msg = args.splice(1).join(' ');
        const receiver = message.mentions.users.first();
        const embed = new MessageEmbed()
            .setTitle(`Incoming message from ${message.author.tag}`)
            .setDescription(msg)
            .setColor(message.guild.me.displayHexColor);
        message.delete();
        receiver.send(embed);
	}
};