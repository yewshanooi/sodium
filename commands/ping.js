const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'ping',
	description: 'Calculates Discord API\'s server latency',
	usage: 'ping',
	cooldown: '3',
	execute (message) {
		const embed = new MessageEmbed()
				.setTitle('Discord API')
				.setDescription('*Calculating.......*')
				.setColor(embedColor);
			message.channel.send(embed).then(msg => {
				const ping = msg.createdTimestamp - message.createdTimestamp;
				const embedAPI = new MessageEmbed()
					.addField('API Latency', `\`${ping}\`ms`)
					.setTimestamp()
					.setColor(embedColor);
				message.channel.send(embedAPI);
			});
		}
	};