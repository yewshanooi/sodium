const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Delete up to 99 messages at one time')
		.addIntegerOption(option => option.setName('value').setDescription('Enter a value (between 1 and 99)').setRequired(true)),
	cooldown: '10',
	guildOnly: true,
	execute (interaction) {
		if (!interaction.guild.me.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_MESSAGES** permission in `Server settings > Roles > Skye > Permissions` to use this command.' });
		if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

			const valueField = interaction.options.getInteger('value');

			if (valueField < 1 || valueField > 99) return interaction.reply({ content: 'Error: You need to input a number between `1` and `99`.' });

			const successEmbed = new MessageEmbed()
				.setDescription(`*Succesfully deleted **${valueField}** message(s)*`)
				.setColor(embedColor);

			interaction.reply({ embeds: [successEmbed], ephemeral: true }).then(interaction.channel.bulkDelete(valueField, true));
		}
};