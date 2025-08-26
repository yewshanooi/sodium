import { MessageFlags, SlashCommandBuilder } from "discord.js";

import type { CommandInteractionOptionResolver, GuildMember } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    apis: ['ENABLE_LAVALINK'],
    gemini: true,
    data: new SlashCommandBuilder()
        .setName("skip").setDescription("Skip the current track")
        .addIntegerOption(o => o.setName("skipto").setDescription("to which song to skip to?").setRequired(false)),
    cooldown: 5,
    category: 'Music',
    guildOnly: true,
    execute: async (client, interaction) => {
        if (!interaction.guildId) return;

        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if (!vcId) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "Join a Voice Channel " });

        const player = client.lavalink.getPlayer(interaction.guildId);
        if (!player) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "I'm not connected" });
        if (player.voiceChannelId !== vcId) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "You need to be in my Voice Channel" })

        const current = player.queue.current;
        const nextTrack = player.queue.tracks[0];

        if (!nextTrack) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: `No Tracks to skip to` });

        let skipTo = 0;
        if (interaction.isChatInputCommand()) {
        skipTo = (interaction.options as CommandInteractionOptionResolver).getInteger("skipto") || 0;
        }
        await player.skip(skipTo);
        await interaction.reply({
            flags: [MessageFlags.Ephemeral], content: current ?
                `Skipped [\`${current?.info.title}\`](<${current?.info.uri}>) -> [\`${nextTrack?.info.title}\`](<${nextTrack?.info.uri}>)` :
                `Skipped to [\`${nextTrack?.info.title}\`](<${nextTrack?.info.uri}>)`
        });
    }
} as Command;
