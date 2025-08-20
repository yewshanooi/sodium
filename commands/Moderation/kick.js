const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick the selected user with or without a reason')
		.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
	cooldown: '25',
	category: 'Moderation',
	guildOnly: true,
	async execute (interaction) {
		const guildDB = await Guild.findOne({ 'guild.id': interaction.guild.id });
			if (!guildDB) return interaction.reply({ embeds: [global.errors[5]] });

        if (!interaction.guild.members.me.permissions.has('KickMembers')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Kick Members** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has('KickMembers')) return interaction.reply({ embeds: [global.errors[2]] });

			const userField = interaction.options.getMember('user');
				if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot kick a bot.' });
				if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot kick yourself.' });

				if (userField.id === interaction.guild.ownerId) return interaction.reply({ content: 'Error: You cannot kick a Guild Owner.' });
				if (userField.permissions.has('Administrator')) return interaction.reply({ content: 'Error: You cannot kick a user with Administrator permission.' });

			let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

		const getId = new mongoose.Types.ObjectId();

		const embed = new EmbedBuilder()
			.setTitle('Kick')
			.setDescription(`\`${getId}\``)
			.addFields(
				{ name: 'User', value: `${userField.user.username} \`${userField.user.id}\`` },
				{ name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
				{ name: 'Reason', value: `${reasonField}` }
			)
			.setTimestamp()
			.setColor('#ff0000');

		try {
			await Guild.findOneAndUpdate({
				'guild.id': interaction.guild.id
			}, {
				$push: {
					logs: {
						_id: getId,
						type: 'Kick',
                        user: {
                            name: userField.user.username,
                            id: userField.user.id
                        },
                        staff: {
                            name: interaction.user.username,
                            id: interaction.user.id
                        },
						reason: reasonField
					}
				}
			});
		} catch (err) {
			console.error(err);
		}

		return interaction.reply({ embeds: [embed] }).then(userField.kick(userField));
	}
};