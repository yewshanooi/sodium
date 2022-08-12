const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '25',
    category: 'Moderation',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.guild.members.me.permissions.has('BanMembers')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Ban Members** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('BanMembers')) return interaction.reply({ embeds: [global.errors[3]] });

            const userField = interaction.options.getMember('user');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot ban a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot ban yourself.' });

                if (userField.id === interaction.guild.ownerId) return interaction.reply({ content: 'Error: You cannot ban a Guild Owner.' });
                if (userField.permissions.has('Administrator')) return interaction.reply({ content: 'Error: You cannot ban a user with Administrator permission.' });

            let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

        const embed = new EmbedBuilder()
            .setTitle('Ban')
            .addFields(
                { name: 'User', value: `${userField}` },
                { name: 'ID', value: `\`${userField.user.id}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        interaction.reply({ embeds: [embed] }).then(userField.ban({ reason: reasonField }));
	}
};