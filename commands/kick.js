const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const errors = require('../errors.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick the selected user with or without a reason')
		.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
	cooldown: '25',
	guildOnly: true,
	execute (interaction) {
        if (!interaction.guild.members.me.permissions.has('KickMembers')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Kick Members** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has('KickMembers')) return interaction.reply({ embeds: [errors[3]] });

			const userField = interaction.options.getMember('user');
				if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot kick a bot.' });
				if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot kick yourself.' });

				if (userField.id === interaction.guild.ownerId) return interaction.reply({ content: 'Error: You cannot kick a Guild Owner.' });
				if (userField.permissions.has('Administrator')) return interaction.reply({ content: 'Error: You cannot kick a user with Administrator permission.' });

			let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

		const embed = new EmbedBuilder()
			.setTitle('Kick')
			.addFields(
				{ name: 'User', value: `${userField}` },
				{ name: 'ID', value: `\`${userField.user.id}\`` },
				{ name: 'By', value: `${interaction.member}` },
				{ name: 'Reason', value: `\`${reasonField}\`` }
			)
			.setTimestamp()
			.setColor('#ff0000');

		interaction.reply({ embeds: [embed] }).then(userField.kick(userField));
	}
};