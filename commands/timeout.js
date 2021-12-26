const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Select a duration').addChoice('60 seconds', 60000).addChoice('5 minutes', 300000).addChoice('10 minutes', 600000).addChoice('1 hour', 3.6e+6).addChoice('1 day', 8.64e+7).addChoice('1 week', 6.048e+8).setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MODERATE_MEMBERS** permission in `Server Settings > Roles > Skye > Permissions` to use this command.' });
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

            const memberField = interaction.options.getMember('user');
                if (memberField.user.bot === true) return interaction.reply({ content: 'Error: You cannot timeout a bot.' });
				// if (memberField.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Error: This user cannot be timeout.' });

                if (memberField === interaction.member) return interaction.reply({ content: 'Error: You cannot timeout yourself.' });

            const durationField = interaction.options.getInteger('duration');

            let resultDuration;
                if (durationField === 60000) resultDuration = '60 seconds';
                if (durationField === 300000) resultDuration = '5 minutes';
                if (durationField === 600000) resultDuration = '10 minutes';
                if (durationField === 3.6e+6) resultDuration = '1 hour';
                if (durationField === 8.64e+7) resultDuration = '1 day';
                if (durationField === 6.048e+8) resultDuration = '1 week';

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

		const embedUserDM = new MessageEmbed()
            .setTitle('Timeout')
            .addFields(
                { name: 'Guild', value: `\`${interaction.guild.name}\`` },
                { name: 'Duration', value: `\`${resultDuration}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#FF0000');

        const embed = new MessageEmbed()
            .setTitle('Timeout')
            .addFields(
                { name: 'User', value: `${memberField}` },
                { name: 'ID', value: `\`${memberField.user.id}\`` },
                { name: 'Duration', value: `\`${resultDuration}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#FF0000');

        memberField.send({ embeds: [embedUserDM] })
            .then(() => {
                interaction.reply({ embeds: [embed] }).then(memberField.timeout(durationField, reasonField));
            })
            .catch(() => {
                interaction.reply({ content: 'Error: Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety` to receive Direct Messages.' });
            });
        }
};