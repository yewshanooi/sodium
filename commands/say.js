const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Get the bot to say your message')
        .addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true)),
	cooldown: '5',
	guildOnly: true,
	execute (interaction) {
		const text = interaction.options.getString('message');

          if (!text) return interaction.reply('Error: Please provide a valid message.');
			const embed = new MessageEmbed()
				.setDescription(`**${interaction.user.username} said:** *${text}*`)
				.setColor(embedColor);
			interaction.reply({ embeds: [embed] });
        }
};