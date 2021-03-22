const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Calculates the API\'s Latency',
	cooldown: '3',
	execute (message) {
		const embedLatency = new MessageEmbed();
				embedLatency.setTitle('Discord API')
				.setDescription('*Calculating Latency...*')
				.setColor(message.guild.me.displayHexColor);
			message.channel.send(embedLatency).then(msg => {
				const ping = msg.createdTimestamp - message.createdTimestamp;
				const embedCalculated = new MessageEmbed();
					embedCalculated.setDescription(`API Latency is \`${ping}\`ms`)
					.setColor(message.guild.me.displayHexColor)
					.setTimestamp();
				message.channel.send(embedCalculated);
			});
		}
	};