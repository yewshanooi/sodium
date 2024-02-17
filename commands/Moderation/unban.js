const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Log = require('../../schemas/log');
const getTimestamp = new Date();

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
		const guildLog = await Log.findOne({ 'guild.id': interaction.guild.id });
			if (guildLog === null) return interaction.reply({ embeds: [global.errors[5]] });

		if (!interaction.guild.members.me.permissions.has('BanMembers')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Ban Members** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has('BanMembers')) return interaction.reply({ embeds: [global.errors[2]] });

			const userIdField = interaction.options.getString('user_id');

			let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

		const embed = new EmbedBuilder()
			.setTitle('Unban')
			.addFields(
				{ name: 'User ID', value: `\`${userIdField}\`` },
				{ name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
				{ name: 'Reason', value: `${reasonField}` }
			)
			.setTimestamp()
			.setColor('#ff0000');

		try {
			await Log.findOneAndUpdate({
				'guild.id': interaction.guild.id
			}, {
				$push: {
					items: {
						type: 'Unban',
						user: {
                            id: userIdField
                        },
                        mod: {
                            name: interaction.user.username,
                            id: interaction.user.id
                        },
						reason: reasonField,
						timestamp: getTimestamp
					}
				}
			});
		}
		catch (err) {
			console.error(err);
		}

		interaction.guild.members.unban(userIdField)
			.then(() => {
				interaction.reply({ embeds: [embed] });
			})
			.catch(() => {
				interaction.reply({ content: 'Error: User ID is invalid or not found.' });
			});

		}
};