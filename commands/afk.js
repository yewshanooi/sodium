const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const noPermission = require('../errors/noPermission.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set another user\'s status as AFK')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addBooleanOption(option => option.setName('option').setDescription('Select whether user is AFK').setRequired(true)),
    cooldown: '10',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_NICKNAMES** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ embeds: [noPermission] });

            const userField = interaction.options.getMember('user');
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot set your own status as AFK.' });

            const optionField = interaction.options.getBoolean('option');
                if (optionField === true) {
                    const embed = new MessageEmbed()
                        .setDescription(`***${userField.user.username}** is now AFK*`)
                        .setColor(embedColor);

                    interaction.reply({ embeds: [embed] }).then(userField.setNickname(`[AFK] ${userField.user.username}`));
                }
                if (optionField === false) {
                    const embed = new MessageEmbed()
                        .setDescription(`***${userField.user.username}** is no longer AFK*`)
                        .setColor(embedColor);

                    interaction.reply({ embeds: [embed] }).then(userField.setNickname(userField.user.username));
                }
        }
};