const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beep')
		.setDescription('Boops back at you!'),
	cooldown: '3',
	guildOnly: false,
	execute (interaction) {
		const embed = new EmbedBuilder()
			.setDescription('**Boop!** ✨')
			.setColor(embedColor);
		interaction.reply({ embeds: [embed] });
	}
};