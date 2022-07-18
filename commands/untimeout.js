const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const privateDM = require('../errors/privateDM.js');
const noPermission = require('../errors/noPermission.js');

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
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ embeds: [noPermission] });

            const userField = interaction.options.getMember('user');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot untimeout a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot untimeout yourself.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const userDmEmbed = new MessageEmbed()
            .setTitle('Untimeout')
            .addFields(
                { name: 'Guild', value: `\`${interaction.guild.name}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        const embed = new MessageEmbed()
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
                interaction.reply({ embeds: [privateDM] });
            });
        }
};