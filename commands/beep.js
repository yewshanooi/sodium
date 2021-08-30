const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beep')
		.setDescription('Boops back at you!'),
	cooldown: '0',
	guildOnly: false,
	execute (interaction) {
		const embed = new MessageEmbed()
			.setDescription('Boop! ✨')
			.setColor(embedColor);
		interaction.reply({ embeds: [embed] });
	}
};