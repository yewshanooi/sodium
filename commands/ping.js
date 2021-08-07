const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'ping',
	description: 'Calculates Discord API\'s and WebSocket\'s latency',
	usage: 'ping',
	cooldown: '5',
	execute (message) {
		const embed = new MessageEmbed()
				.setTitle('Ping')
				.setDescription('*Calculating Latency.*')
				.setColor(embedColor);
			message.channel.send(embed).then(msg => {
				const ping = msg.createdTimestamp - message.createdTimestamp;
				const embedAPI = new MessageEmbed()
					.addField('API Latency', `\`${ping}\`ms`)
					.addField('WebSocket Latency', `\`${message.client.ws.ping}\`ms`)
					.setTimestamp()
					.setColor(embedColor);
				message.channel.send(embedAPI);
			});
		}
	};