const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Untimeout the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MODERATE_MEMBERS** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

            const memberField = interaction.options.getMember('user');
                if (memberField.user.bot === true) return interaction.reply({ content: 'Error: You cannot untimeout a bot.' });
                if (memberField === interaction.member) return interaction.reply({ content: 'Error: You cannot untimeout yourself.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const embedUserDM = new MessageEmbed()
            .setTitle('Untimeout')
            .addFields(
                { name: 'Guild', value: `\`${interaction.guild.name}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#FF0000');

        const embed = new MessageEmbed()
            .setTitle('Untimeout')
            .addFields(
                { name: 'User', value: `${memberField}` },
                { name: 'ID', value: `\`${memberField.user.id}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#FF0000');

        memberField.send({ embeds: [embedUserDM] })
            .then(() => {
                interaction.reply({ embeds: [embed] }).then(memberField.timeout(null));
            })
            .catch(() => {
                interaction.reply({ content: 'Error: Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety` to receive Direct Messages.' });
            });
        }
};