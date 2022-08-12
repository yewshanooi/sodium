const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    category: 'Moderation',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.members.me.permissions.has('ManageMessages')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Messages** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageMessages')) return interaction.reply({ embeds: [global.errors[3]] });

            const userField = interaction.options.getMember('user');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot warn a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot warn yourself.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const userDmEmbed = new EmbedBuilder()
            .setTitle('Warn')
            .addFields(
                { name: 'Guild', value: `\`${interaction.guild.name}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        const embed = new EmbedBuilder()
            .setTitle('Warn')
            .addFields(
                { name: 'User', value: `${userField}` },
                { name: 'ID', value: `\`${userField.user.id}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        userField.send({ embeds: [userDmEmbed] })
            .then(() => {
                interaction.reply({ embeds: [embed] });
            })
            .catch(() => {
                interaction.reply({ embeds: [global.errors[4]] });
            });
        }
};