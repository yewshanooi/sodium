const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Calculates the API\'s Latency',
	cooldown: '3',
	execute (message) {
		message.channel.send('*Calculating latency...*').then(msg => {
			const ping = msg.createdTimestamp - message.createdTimestamp;
			const embed = new MessageEmbed();
				embed.setTitle('Pong!')
				.setDescription(`API Latency is \`${ping}\``)
				.setColor(message.guild.me.displayHexColor);
			message.channel.send(embed);
			});
		}
	};