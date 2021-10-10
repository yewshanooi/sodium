const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botpresence')
        .setDescription('Change bot\'s current presence globally')
        .addStringOption(option => option.setName('activity').setDescription('Enter an activity').setRequired(true))
        .addStringOption(option => option.setName('type').setDescription('Enter a type (playing, listening, watching or competing)').setRequired(true))
        .addStringOption(option => option.setName('status').setDescription('Enter a status (online, idle, dnd or invisible)').setRequired(true)),
    cooldown: '30',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply('Error: You have no permission to use this command.');

            const activityField = interaction.options.getString('activity');

            const typeField = interaction.options.getString('type');
                if (typeField !== 'playing' && typeField !== 'listening' && typeField !== 'watching' && typeField !== 'competing') {
                    return interaction.reply('Error: No such type.\n*(Available options - `playing`, `listening`, `watching` or `competing`)*');
                }

                const typeFieldAllCaps = typeField.toUpperCase();
                const typeFieldFirstCaps = typeField.charAt(0).toUpperCase() + typeField.slice(1);

            const statusField = interaction.options.getString('status');
                if (statusField !== 'online' && statusField !== 'idle' && statusField !== 'dnd' && statusField !== 'invisible') {
                    return interaction.reply('Error: No such status.\n*(Available options - `online`, `idle`, `dnd` or `invisible`)*');
                }

                let resultStatus;
                    if (statusField === 'online') resultStatus = 'Online';
                    if (statusField === 'idle') resultStatus = 'Idle';
                    if (statusField === 'dnd') resultStatus = 'Do Not Disturb';
                    if (statusField === 'invisible') resultStatus = 'Invisible';

            const embed = new MessageEmbed()
                .setTitle('Bot Presence')
                .setDescription('Successfully changed bot\'s current presence')
                .addFields(
                    { name: 'Activity', value: activityField },
                    { name: 'Type', value: typeFieldFirstCaps, inline: true },
                    { name: 'Status', value: resultStatus, inline: true }
                )
                .setColor(embedColor);

            interaction.client.user.setPresence({ activities: [{ name: `${activityField}`, type: `${typeFieldAllCaps}` }], status: `${statusField}` });
                interaction.reply({ embeds: [embed] });
        }
};