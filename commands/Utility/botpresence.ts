import { EmbedBuilder, SlashCommandBuilder, ActivityType, PermissionsBitField } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName('botpresence')
        .setDescription('Change bot\'s current activity for all guilds')
        .addStringOption(option => option.setName('activity').setDescription('Enter an activity').setRequired(true))
        .addStringOption(option => option.setName('type').setDescription('Select a type').addChoices({ name: 'Playing', value: 'Playing' }, { name: 'Streaming', value: 'Streaming' }, { name: 'Listening', value: 'Listening' }, { name: 'Watching', value: 'Watching' }, { name: 'Competing', value: 'Competing' }, { name: 'Custom', value: 'Custom' }).setRequired(true))
        .addStringOption(option => option.setName('status').setDescription('Select a status').addChoices({ name: 'Online', value: 'online' }, { name: 'Idle', value: 'idle' }, { name: 'Do Not Disturb', value: 'dnd' }, { name: 'Invisible', value: 'invisible' }).setRequired(false)),
    gemini: true,
    cooldown: 25,
    category: 'Utility',
    guildOnly: true,
    execute: (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [client.errors.noPermission] });

            const activityField = interaction.options.getString('activity');

            const typeField = interaction.options.getString('type');
            let resultType;
                if (typeField === 'Playing') resultType = ActivityType.Playing;
                if (typeField === 'Streaming') resultType = ActivityType.Streaming;
                if (typeField === 'Listening') resultType = ActivityType.Listening;
                if (typeField === 'Watching') resultType = ActivityType.Watching;
                if (typeField === 'Competing') resultType = ActivityType.Competing;
                if (typeField === 'Custom') resultType = ActivityType.Custom;

            const statusField = interaction.options.getString('status');
            let resultStatus;
            let presenceStatus: 'online' | 'idle' | 'dnd' | 'invisible';
            if (!statusField) {
                resultStatus = 'Online';
                presenceStatus = 'online';
            } else {
                if (statusField === 'online') {
                    resultStatus = 'Online';
                    presenceStatus = 'online';
                }
                if (statusField === 'idle') {
                    resultStatus = 'Idle';
                    presenceStatus = 'idle';
                }
                if (statusField === 'dnd') {
                    resultStatus = 'Do Not Disturb';
                    presenceStatus = 'dnd';
                }
                if (statusField === 'invisible') {
                    resultStatus = 'Invisible';
                    presenceStatus = 'invisible';
                }
            }

            const linkField = 'https://www.twitch.tv/directory';

            const embed = new EmbedBuilder()
                .setTitle('Bot Presence')
                .addFields(
                    { name: 'Activity', value: `${activityField}` },
                    { name: 'Type', value: `\`${typeField}\``, inline: true },
                    { name: 'Status', value: `\`${resultStatus}\``, inline: true }
                )
                .setColor(client.embedColor as any);

            if (typeField === 'Streaming') {
                embed.addFields({ name: 'Stream Link', value: `${linkField}` });
            }
            
            const player = client.lavalink.getPlayer(interaction.guildId);
            if (!player || !player.playing) {
                interaction.client.user.setPresence({ activities: [{ name: `${activityField}`, type: resultType, url: linkField }], status: presenceStatus });
                interaction.reply({ embeds: [embed] });
            } else {
                interaction.reply({ content: 'You cannot change the bot\'s presence while it is in a song.', ephemeral: true });
            }
        }
} as Command;