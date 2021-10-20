const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Calculates Discord API\'s and WebSocket\'s latency'),
	cooldown: '5',
	guildOnly: false,
	execute (interaction) {
		const embed = new MessageEmbed()
				.setTitle('Ping')
				.setDescription('*Calculating Latency.*')
				.setColor(embedColor);
			interaction.reply({ embeds: [embed], fetchReply: true }).then(itr => {
				const ping = itr.createdTimestamp - interaction.createdTimestamp;
				const embedAPI = new MessageEmbed()
					.addField('API Latency', `\`${ping}\`ms`)
					.addField('WebSocket Latency', `\`${interaction.client.ws.ping}\`ms`)
					.setTimestamp()
					.setColor(embedColor);
				interaction.channel.send({ embeds: [embedAPI] });
			});
		}
};