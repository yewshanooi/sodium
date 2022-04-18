const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Select a duration').addChoices({ name: '60 seconds', value: 60000 }, { name: '5 minutes', value: 300000 }, { name: '10 minutes', value: 600000 }, { name: '1 hour', value: 3.6e+6 }, { name: '1 day', value: 8.64e+7 }, { name: '1 week', value: 6.048e+8 }).setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MODERATE_MEMBERS** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

            const userField = interaction.options.getMember('user');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot timeout a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot timeout yourself.' });

            const durationField = interaction.options.getInteger('duration');

            let resultDurationField;
                if (durationField === 60000) resultDurationField = '60 seconds';
                if (durationField === 300000) resultDurationField = '5 minutes';
                if (durationField === 600000) resultDurationField = '10 minutes';
                if (durationField === 3.6e+6) resultDurationField = '1 hour';
                if (durationField === 8.64e+7) resultDurationField = '1 day';
                if (durationField === 6.048e+8) resultDurationField = '1 week';

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

		const userDmEmbed = new MessageEmbed()
            .setTitle('Timeout')
            .addFields(
                { name: 'Guild', value: `\`${interaction.guild.name}\`` },
                { name: 'Duration', value: `\`${resultDurationField}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        const embed = new MessageEmbed()
            .setTitle('Timeout')
            .addFields(
                { name: 'User', value: `${userField}` },
                { name: 'ID', value: `\`${userField.user.id}\`` },
                { name: 'Duration', value: `\`${resultDurationField}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        userField.send({ embeds: [userDmEmbed] })
            .then(() => {
                interaction.reply({ embeds: [embed] }).then(userField.timeout(durationField, reasonField));
            })
            .catch(() => {
                interaction.reply({ content: 'Error: Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety` to receive Direct Messages.' });
            });
        }
};