const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick the selected user with or without a reason')
		.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
	cooldown: '25',
	guildOnly: true,
	execute (interaction) {
        if (!interaction.guild.me.permissions.has('KICK_MEMBERS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **KICK_MEMBERS** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has('KICK_MEMBERS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

			const userField = interaction.options.getMember('user');
				if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot kick a bot.' });
				if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot kick yourself.' });

			let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

		const embed = new MessageEmbed()
			.setTitle('Kick')
			.addFields(
				{ name: 'User', value: `${userField}` },
				{ name: 'ID', value: `\`${userField.user.id}\`` },
				{ name: 'By', value: `${interaction.member}` },
				{ name: 'Reason', value: `\`${reasonField}\`` }
			)
			.setTimestamp()
			.setColor('#FF0000');

		interaction.reply({ embeds: [embed] }).then(userField.kick(userField));
	}
};