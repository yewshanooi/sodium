const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban the user id with or without a reason')
		.addStringOption(option => option.setName('userid').setDescription('Enter a user id').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '30',
    guildOnly: true,
    execute (interaction) {
		if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) return interaction.reply('Error: Bot permission denied. Enable **BAN_MEMBERS** permission in `Server settings > Roles > Skye > Permissions` to use this command.');
		if (!interaction.member.permissions.has('BAN_MEMBERS')) return interaction.reply('Error: You have no permission to use this command.');

			const userIdField = interaction.options.getString('userid');

			let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

		const embed = new MessageEmbed()
			.setTitle('Unban')
			.addFields(
                { name: 'User ID', value: `\`${userIdField}\`` },
                { name: 'By', value: `\`${interaction.user.tag}\`` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
			.setTimestamp()
            .setColor('#FF0000');

		interaction.guild.members.unban(userIdField)
			.then(() => {
				interaction.reply({ embeds: [embed] });
			})
			.catch(() => {
				interaction.reply('Error: User ID is invalid or not found.');
			});
		}
};