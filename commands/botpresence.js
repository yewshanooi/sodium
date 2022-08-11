/* eslint-disable no-undef */
const { EmbedBuilder, SlashCommandBuilder, ActivityType } = require('discord.js');
const errors = require('../errors.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botpresence')
        .setDescription('Change bot\'s current presence in every server')
        .addStringOption(option => option.setName('type').setDescription('Select a type').addChoices({ name: 'Playing', value: 'Playing' }, { name: 'Streaming', value: 'Streaming' }, { name: 'Listening', value: 'Listening' }, { name: 'Watching', value: 'Watching' }, { name: 'Competing', value: 'Competing' }).setRequired(true))
        .addStringOption(option => option.setName('activity').setDescription('Enter an activity').setRequired(true))
        .addStringOption(option => option.setName('status').setDescription('Select a status').addChoices({ name: 'Online', value: 'online' }, { name: 'Idle', value: 'idle' }, { name: 'Do Not Disturb', value: 'dnd' }, { name: 'Invisible', value: 'invisible' }).setRequired(true))
        .addStringOption(option => option.setName('link').setDescription('Enter a stream link (only necessary for Streaming option)')),
    cooldown: '25',
    guildOnly: true,
    execute (interaction, configuration) {
        if (!interaction.member.permissions.has('Administrator')) return interaction.reply({ embeds: [errors[3]] });
            const typeField = interaction.options.getString('type');
            let resultType;
                if (typeField === 'Playing') resultType = ActivityType.Playing;
                if (typeField === 'Streaming') resultType = ActivityType.Streaming;
                if (typeField === 'Listening') resultType = ActivityType.Listening;
                if (typeField === 'Watching') resultType = ActivityType.Watching;
                if (typeField === 'Competing') resultType = ActivityType.Competing;

            const activityField = interaction.options.getString('activity');

            const statusField = interaction.options.getString('status');
            let resultStatus;
                if (statusField === 'online') resultStatus = 'Online';
                if (statusField === 'idle') resultStatus = 'Idle';
                if (statusField === 'dnd') resultStatus = 'Do Not Disturb';
                if (statusField === 'invisible') resultStatus = 'Invisible';

            let linkField = interaction.options.getString('link');
            let resultLink = linkField;
                if (!linkField || !linkField.includes('youtube.') && !linkField.includes('twitch.')) {
                    resultLink = 'None';
                    linkField = 'https://www.twitch.tv/discord';
                }
                // Custom Link seems to be broken at the moment. Bot will not change Status if user set a Custom Link.

            const embed = new EmbedBuilder()
                .setDescription('Successfully changed bot\'s presence')
                .addFields(
                    { name: 'Activity', value: `${activityField}` },
                    { name: 'Type', value: `\`${typeField}\``, inline: true },
                    { name: 'Status', value: `\`${resultStatus}\``, inline: true },
                    { name: 'Stream Link', value: `${resultLink}` }
                )
                .setColor(configuration.embedColor);

            interaction.client.user.setPresence({ activities: [{ name: `${activityField}`, type: resultType, url: linkField }], status: `${statusField}` });
                interaction.reply({ embeds: [embed] });
        }
};