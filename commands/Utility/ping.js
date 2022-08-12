const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Calculates Discord API and WebSocket latency'),
	cooldown: '3',
	category: 'Utility',
	guildOnly: false,
	execute (interaction, configuration) {
		const embed = new EmbedBuilder()
			.setDescription('*Calculating latency..*')
			.setColor(configuration.embedColor);
		interaction.reply({ embeds: [embed], fetchReply: true }).then(itr => {
			const timestamp = itr.createdTimestamp - interaction.createdTimestamp;
			const newEmbed = new EmbedBuilder()
				.setTitle('Ping')
				.addFields(
					{ name: 'API Latency', value: `\`${timestamp}\`ms` },
					{ name: 'WebSocket Latency', value: `\`${interaction.client.ws.ping}\`ms` }
				)
				.setColor(configuration.embedColor);
			interaction.editReply({ embeds: [newEmbed] });
		});

	}
};