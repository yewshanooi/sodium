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
					.addFields(
						{ name: 'Name', value: `\`${interaction.user.username}\``, inline: true },
						{ name: 'ID', value: `\`${interaction.user.id}\``, inline: true },
						{ name: 'Creation Date & Time', value: `\`${interaction.user.createdAt}\`` },
						{ name: 'Tag', value: `\`${interaction.user.tag}\``, inline: true },
						{ name: 'Discriminator', value: `\`${interaction.user.discriminator}\``, inline: true }
					)
					.setColor(embedColor);
				interaction.reply({ embeds: [embedSelf] });
			}
			if (userField) {
				const embedOthers = new MessageEmbed()
					.setTitle('User Info')
					.addFields(
						{ name: 'Name', value: `\`${userField.username}\``, inline: true },
						{ name: 'ID', value: `\`${userField.id}\``, inline: true },
						{ name: 'Creation Date & Time', value: `\`${userField.createdAt}\`` },
						{ name: 'Tag', value: `\`${userField.tag}\``, inline: true },
						{ name: 'Discriminator', value: `\`${userField.discriminator}\``, inline: true }
					)
					.setColor(embedColor);
				interaction.reply({ embeds: [embedOthers] });
			}
		}
};