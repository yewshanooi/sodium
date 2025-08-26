import { MessageFlags, SlashCommandBuilder } from "discord.js";

import type { GuildMember } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    apis: ['ENABLE_LAVALINK'],
    gemini: true,
    data: new SlashCommandBuilder()
        .setName("resume").setDescription("Resume the player"),
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

        if (!player.paused) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "Not paused" })

        await player.resume();

        await interaction.reply({
            flags: [MessageFlags.Ephemeral], content: `Resumed the player`
        });
    }
} as Command;
