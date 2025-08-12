const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildLog, addLogItem } = require('../../scheme.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '25',
    category: 'Moderation',
    guildOnly: true,
	async execute (interaction) {
        const guildLog = await getGuildLog(interaction.client, interaction.guild.id);
        if (guildLog === null) return interaction.reply({ embeds: [global.errors[5]] });

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Ban Members** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ embeds: [global.errors[2]] });

            const userField = interaction.options.getMember('user');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot ban a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot ban yourself.' });

                if (userField.user.id === interaction.guild.ownerId) return interaction.reply({ content: 'Error: You cannot ban a Guild Owner.' });
                if (userField.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'Error: You cannot ban a user with Administrator permission.', ephemeral: true });

            let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

        const getId = await addLogItem(interaction.client, interaction.guild.id, 'Ban', userField.user, interaction.user, reasonField);

        const embed = new EmbedBuilder()
            .setTitle('Ban')
            .setDescription(`\`${getId}\``)
            .addFields(
                { name: 'User', value: `${userField.user.username} \`${userField.user.id}\`` },
                { name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
                { name: 'Reason', value: `${reasonField}` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        return interaction.reply({ embeds: [embed] }).then(userField.ban({ reason: reasonField }));
	}
};