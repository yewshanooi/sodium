const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get your own avatar or another user\'s avatar')
		.addUserOption(option => option.setName('user').setDescription('Select a user')),
	cooldown: '5',
	guildOnly: false,
	execute (interaction) {
		const userField = interaction.options.getUser('user');

		if (!userField) {
			const embedSelf = new MessageEmbed()
				.setTitle('Your Avatar')
				.setImage(`${interaction.user.displayAvatarURL({ dynamic: true })}`)
				.setColor(embedColor);

				const buttonSelf = new MessageActionRow()
					.addComponents(new MessageButton()
						.setURL(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`)
						.setLabel('Avatar JPEG')
						.setStyle('LINK'));

			interaction.reply({ embeds: [embedSelf], components: [buttonSelf] });
		}

		if (userField) {
			const embedOthers = new MessageEmbed()
				.setTitle(`${userField.username}'s Avatar`)
				.setImage(`${userField.displayAvatarURL({ dynamic: true })}`)
				.setColor(embedColor);

				const buttonOthers = new MessageActionRow()
					.addComponents(new MessageButton()
						.setURL(`https://cdn.discordapp.com/avatars/${userField.id}/${userField.avatar}.jpeg`)
						.setLabel('Avatar JPEG')
						.setStyle('LINK'));

			interaction.reply({ embeds: [embedOthers], components: [buttonOthers] });
		}
	}
};