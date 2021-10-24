const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Get the bot to send your message with or without a spoiler')
		.addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true))
		.addBooleanOption(option => option.setName('spoiler').setDescription('Choose whether message contains spoiler').setRequired(true)),
	cooldown: '5',
	guildOnly: true,
	execute (interaction) {
		const messageField = interaction.options.getString('message');
		const spoilerField = interaction.options.getBoolean('spoiler');

		if (spoilerField === false) {
			const embed = new MessageEmbed()
				.setDescription(`**${interaction.user.username} said:** ${messageField}`)
				.setColor(embedColor);
			interaction.reply({ embeds: [embed] });
        }

		if (spoilerField === true) {
			const embed = new MessageEmbed()
                .setDescription(`**${interaction.user.username} said:** ||${messageField}||`)
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] });
		}

	}
};