const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Remove messages from guild channel')
		.addIntegerOption(option => option.setName('amount').setDescription('Enter an integer (between 1 and 99)').setRequired(true)),
	cooldown: '10',
	guildOnly: true,
	execute (interaction) {
		if (!interaction.guild.me.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_MESSAGES** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

		const amountField = interaction.options.getInteger('amount');
			if (amountField < 1 || amountField > 99) return interaction.reply({ content: 'Error: You need to input a valid integer between `1` and `99`.' });

			const successEmbed = new MessageEmbed()
				.setDescription(`*Succesfully removed **${amountField}** message(s)*`)
				.setColor(embedColor);
			interaction.reply({ embeds: [successEmbed], ephemeral: true }).then(interaction.channel.bulkDelete(amountField, true));
		}
};