const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Delete up to 99 messages at one time')
		.addIntegerOption(option => option.setName('value').setDescription('Enter a value').setRequired(true)),
	cooldown: '10',
	guildOnly: true,
	execute (interaction) {
		if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply('Error: You have no permission to use this command.');
			const valueField = interaction.options.getInteger('value');

			if (valueField < 1 || valueField > 99) return interaction.reply('Error: You need to input a number between `1` and `99`.');

			const embed = new MessageEmbed()
				.setTitle('Delete')
				.setDescription(`Succesfully deleted **${valueField}** message(s)`)
				.setTimestamp()
				.setColor(embedColor);

			interaction.channel.bulkDelete(valueField, true);
			interaction.reply({ embeds: [embed], fetchReply: true }).then(msg => {
				setTimeout(() => msg.delete(), 6000);
			});
		}
};