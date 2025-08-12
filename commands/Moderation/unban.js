const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildLog, addLogItem } = require('../../scheme.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unban the user ID with or without a reason')
		.addStringOption(option => option.setName('user_id').setDescription('Enter a user id').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
	cooldown: '25',
	category: 'Moderation',
	guildOnly: true,
    async execute (interaction) {
		const guildLog = await getGuildLog(interaction.client, interaction.guild.id);
		if (guildLog === null) return interaction.reply({ embeds: [global.errors[5]] });

		if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Ban Members** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ embeds: [global.errors[2]] });

			const userIdField = interaction.options.getString('user_id');

			let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

		const userPlaceholder = { id: userIdField, username: 'Unknown User' };
		const getId = await addLogItem(interaction.client, interaction.guild.id, 'Unban', userPlaceholder, interaction.user, reasonField);

		const embed = new EmbedBuilder()
			.setTitle('Unban')
			.setDescription(`\`${getId}\``)
			.addFields(
				{ name: 'User ID', value: `\`${userIdField}\`` },
				{ name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
				{ name: 'Reason', value: `${reasonField}` }
			)
			.setTimestamp()
			.setColor('#ff0000');

		interaction.guild.members.unban(userIdField)
			.then(() => {
				interaction.reply({ embeds: [embed] });
			})
			.catch(() => {
				interaction.reply({ content: 'Error: User ID is invalid or not found.' });
			});

		}
};