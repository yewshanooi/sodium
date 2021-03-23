const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'say',
	description: 'Get the bot to say your message',
	cooldown: '5',
	usage: '{message}',
	execute (message, args) {
		const sayMsg = args.join(' ');
			const embed = new MessageEmbed()
			.setDescription(`${message.author.username} said: ${sayMsg}`)
			.setColor(message.guild.me.displayHexColor);
        message.delete();
        message.channel.send(embed);
	}
};