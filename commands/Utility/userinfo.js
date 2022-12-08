const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Display information about the selected user')
		.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
	cooldown: '3',
	category: 'Utility',
	guildOnly: true,
	execute (interaction, configuration) {
		const userField = interaction.options.getUser('user');
		const memberUserField = interaction.options.getMember('user');

		const { bot } = userField;
		let resultBot;
			if (bot === true) resultBot = 'Yes';
			else resultBot = 'No';

		const hoistRole = memberUserField.roles.hoist;
		let resultHoistRole;
			if (hoistRole === null) resultHoistRole = '`None`';
			else resultHoistRole = hoistRole;

			const embedOthers = new EmbedBuilder()
				.setTitle(`${userField.tag}`)
				.setThumbnail(`https://cdn.discordapp.com/avatars/${userField.id}/${userField.avatar}.jpeg`)
				.addFields(
					{ name: 'Nickname', value: `\`${memberUserField.nickname || 'None'}\``, inline: true },
					{ name: 'ID', value: `\`${userField.id}\``, inline: true },
					{ name: 'Creation Date & Time', value: `\`${userField.createdAt}\`` },
					{ name: 'Is Bot', value: `\`${resultBot}\``, inline: true },
					{ name: 'Hoist Role', value: `${resultHoistRole}`, inline: true },
					{ name: 'Role Color (HEX)', value: `\`${memberUserField.displayHexColor}\``, inline: true },
					{ name: 'Joined Guild At', value: `\`${memberUserField.joinedAt}\`` }
				)
				.setColor(configuration.embedColor);
			interaction.reply({ embeds: [embedOthers] });
		}
};