const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const noPermission = require('../errors/noPermission.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botpresence')
        .setDescription('Change bot\'s current presence in every server')
        .addStringOption(option => option.setName('activity').setDescription('Enter an activity').setRequired(true))
        .addStringOption(option => option.setName('type').setDescription('Select a type').addChoices({ name: 'Playing', value: 'PLAYING' }, { name: 'Listening', value: 'LISTENING' }, { name: 'Watching', value: 'WATCHING' }, { name: 'Competing', value: 'COMPETING' }).setRequired(true))
        .addStringOption(option => option.setName('status').setDescription('Select a status').addChoices({ name: 'Online', value: 'online' }, { name: 'Idle', value: 'idle' }, { name: 'Do Not Disturb', value: 'dnd' }, { name: 'Invisible', value: 'invisible' }).setRequired(true)),
    cooldown: '25',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ embeds: [noPermission] });

            const activityField = interaction.options.getString('activity');

            const typeField = interaction.options.getString('type');

                let resultType;
                    if (typeField === 'PLAYING') resultType = 'Playing';
                    if (typeField === 'LISTENING') resultType = 'Listening';
                    if (typeField === 'WATCHING') resultType = 'Watching';
                    if (typeField === 'COMPETING') resultType = 'Competing';

            const statusField = interaction.options.getString('status');

                let resultStatus;
                    if (statusField === 'online') resultStatus = 'Online';
                    if (statusField === 'idle') resultStatus = 'Idle';
                    if (statusField === 'dnd') resultStatus = 'Do Not Disturb';
                    if (statusField === 'invisible') resultStatus = 'Invisible';

            const embed = new MessageEmbed()
                .setDescription('Successfully changed bot\'s presence')
                .addFields(
                    { name: 'Activity', value: `${activityField}` },
                    { name: 'Type', value: `\`${resultType}\``, inline: true },
                    { name: 'Status', value: `\`${resultStatus}\``, inline: true }
                )
                .setColor(embedColor);

            interaction.client.user.setPresence({ activities: [{ name: `${activityField}`, type: `${typeField}` }], status: `${statusField}` });
                interaction.reply({ embeds: [embed] });
        }
};