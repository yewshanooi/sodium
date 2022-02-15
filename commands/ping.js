const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Calculates Discord API\'s and WebSocket\'s latency'),
	cooldown: '3',
	guildOnly: false,
	execute (interaction) {
		const embed = new MessageEmbed()
				.setDescription('*Calculating Latency..*')
				.setColor(embedColor);
			interaction.reply({ embeds: [embed], fetchReply: true }).then(itr => {
				const ping = itr.createdTimestamp - interaction.createdTimestamp;
				const embedAPI = new MessageEmbed()
					.setTitle('Ping')
					.addFields(
						{ name: 'API Latency', value: `\`${ping}\`ms` },
						{ name: 'WebSocket Latency', value: `\`${interaction.client.ws.ping}\`ms` }
					)
					.setColor(embedColor);
				interaction.editReply({ embeds: [embedAPI] });
			});
		}
};