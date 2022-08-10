const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Untimeout the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    guildOnly: true,
    execute (interaction, configuration, errors) {
        if (!interaction.guild.members.me.permissions.has('ModerateMembers')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Moderate Members** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ModerateMembers')) return interaction.reply({ embeds: [errors[3] /*noPermission*/ ] });

            const userField = interaction.options.getMember('user');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot untimeout a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot untimeout yourself.' });
                if (userField.isCommunicationDisabled() === false) return interaction.reply({ content: 'Error: This user is currently not being timeout.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const userDmEmbed = new EmbedBuilder()
            .setTitle('Untimeout')
            .addFields(
                { name: 'Guild', value: `\`${interaction.guild.name}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        const embed = new EmbedBuilder()
            .setTitle('Untimeout')
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
                interaction.reply({ embeds: [embed] }).then(userField.timeout(null));
            })
            .catch(() => {
                interaction.reply({ embeds: [errors[4] /*privateDM*/ ] });
            });
        }
};