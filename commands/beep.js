const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beep')
		.setDescription('Boops back at you!'),
	cooldown: '3',
	guildOnly: false,
	execute (interaction, configuration) {
		const embed = new EmbedBuilder()
			.setDescription('**Boop!** ✨')
			.setColor(configuration.embedColor);
		interaction.reply({ embeds: [embed] });
	}
};