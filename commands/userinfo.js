const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Display your own or another user\'s information(s)')
		.addUserOption(option => option.setName('user').setDescription('Select a user')),
	cooldown: '5',
	guildOnly: false,
	execute (interaction) {
		const userField = interaction.options.getUser('user');

			if (!userField) {
				const embedSelf = new MessageEmbed()
					.setTitle('User Info')
					.addField('Name', `\`${interaction.user.username}\``, true)
					.addField('ID', `\`${interaction.user.id}\``, true)
					.addField('Creation Date & Time', `\`${interaction.user.createdAt}\``)
					.addField('Tag', `\`${interaction.user.tag}\``, true)
					.addField('Discriminator', `\`${interaction.user.discriminator}\``, true)
					.setColor(embedColor);
				interaction.reply({ embeds: [embedSelf] });
			}
			if (userField) {
				const embedOthers = new MessageEmbed()
					.setTitle('User Info')
					.addField('Name', `\`${userField.username}\``, true)
					.addField('ID', `\`${userField.id}\``, true)
					.addField('Creation Date & Time', `\`${userField.createdAt}\``)
					.addField('Tag', `\`${userField.tag}\``, true)
					.addField('Discriminator', `\`${userField.discriminator}\``, true)
					.setColor(embedColor);
				interaction.reply({ embeds: [embedOthers] });
			}
		}
};