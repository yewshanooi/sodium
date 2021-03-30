const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'ping',
	description: 'Calculates Discord API\'s server latency',
	usage: 'ping',
	cooldown: '3',
	execute (message) {
		const embedLatency = new MessageEmbed()
				.setTitle('Discord API')
				.setDescription('*Calculating.......*')
				.setColor(embedColor);
			message.channel.send(embedLatency).then(msg => {
				const ping = msg.createdTimestamp - message.createdTimestamp;
				const embedCalculated = new MessageEmbed()
					.addField('API Latency', `\`${ping}\`ms`)
					.setColor(embedColor)
					.setTimestamp();
				message.channel.send(embedCalculated);
			});
		}
	};