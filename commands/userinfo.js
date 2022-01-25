const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Display information(s) about the selected user')
		.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
	cooldown: '3',
	guildOnly: false,
	execute (interaction) {
		const userField = interaction.options.getUser('user');
		const memberField = interaction.options.getMember('user');

		const isBot2 = userField.bot;
		let resultBot2;
			if (isBot2 === true) resultBot2 = 'Yes';
			else resultBot2 = 'No';

			const embedOthers = new MessageEmbed()
				.setTitle(`${userField.tag}`)
				.setThumbnail(`https://cdn.discordapp.com/avatars/${userField.id}/${userField.avatar}.jpeg`)
				.addFields(
					{ name: 'Nickname', value: `\`${memberField.nickname || 'None'}\``, inline: true },
					{ name: 'ID', value: `\`${userField.id}\``, inline: true },
					{ name: 'Creation Date & Time', value: `\`${userField.createdAt}\`` },
					{ name: 'Is Bot', value: `\`${resultBot2}\``, inline: true },
					{ name: 'Hoist Role', value: `${memberField.roles.hoist}`, inline: true },
					{ name: 'Role Color (Hex)', value: `\`${memberField.displayHexColor}\``, inline: true },
					{ name: 'Joined Guild At', value: `\`${memberField.joinedAt}\`` }
				)
				.setColor(embedColor);
			interaction.reply({ embeds: [embedOthers] });
		}
};