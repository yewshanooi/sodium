const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'ping',
	description: 'Calculates the API\'s Latency',
	cooldown: '3',
	execute (message) {
		const embedLatency = new MessageEmbed();
				embedLatency.setTitle('Discord API')
				.setDescription('*Calculating Latency...*')
				.setColor(embedColor);
			message.channel.send(embedLatency).then(msg => {
				const ping = msg.createdTimestamp - message.createdTimestamp;
				const embedCalculated = new MessageEmbed();
					embedCalculated.setDescription(`API Latency is \`${ping}\`ms`)
					.setColor(embedColor)
					.setTimestamp();
				message.channel.send(embedCalculated);
			});
		}
	};