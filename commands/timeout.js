const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Select a duration').addChoices({ name: '60 seconds', value: 60000 }, { name: '5 minutes', value: 300000 }, { name: '10 minutes', value: 600000 }, { name: '1 hour', value: 3.6e+6 }, { name: '1 day', value: 8.64e+7 }, { name: '1 week', value: 6.048e+8 }).setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    guildOnly: true,
    execute (interaction, configuration, errors) {
        if (!interaction.guild.members.me.permissions.has('ModerateMembers')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Moderate Members** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ModerateMembers')) return interaction.reply({ embeds: [errors[3] /*noPermission*/ ] });

            const userField = interaction.options.getMember('user');
            const durationField = interaction.options.getInteger('duration');

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

            userField.timeout(durationField, reasonField);
        }
};