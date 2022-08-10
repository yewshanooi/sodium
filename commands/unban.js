const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const errors = require('../errors.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unban the User ID with or without a reason')
		.addStringOption(option => option.setName('user_id').setDescription('Enter a user id').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
	cooldown: '25',
	guildOnly: true,
    execute (interaction) {
		if (!interaction.guild.members.me.permissions.has('BanMembers')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Ban Members** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has('BanMembers')) return interaction.reply({ embeds: [errors[3]] });

			const userIdField = interaction.options.getString('user_id');

			let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

		const embed = new EmbedBuilder()
			.setTitle('Unban')
			.addFields(
				{ name: 'ID', value: `\`${userIdField}\`` },
				{ name: 'By', value: `${interaction.member}` },
				{ name: 'Reason', value: `\`${reasonField}\`` }
			)
			.setTimestamp()
			.setColor('#ff0000');

		interaction.guild.members.unban(userIdField)
			.then(() => {
				interaction.reply({ embeds: [embed] });
			})
			.catch(() => {
				interaction.reply({ content: 'Error: User ID not found or is invalid.' });
			});
		}
};