const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beep')
		.setDescription('Boops back at you!'),
	cooldown: '3',
	category: 'Fun',
	guildOnly: false,
	execute (interaction, client) {
		const embed = new EmbedBuilder()
			.setDescription('**Boop!** ✨')
			.setColor(client.config.embedColor);
		interaction.reply({ embeds: [embed] });
	}
};