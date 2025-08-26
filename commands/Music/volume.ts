import { MessageFlags, SlashCommandBuilder } from "discord.js";

import type { CommandInteractionOptionResolver, GuildMember } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    apis: ['ENABLE_LAVALINK'],
    gemini: true,
    data: new SlashCommandBuilder()
        .setName("volume").setDescription("Change the Volume of the Player")
        .addIntegerOption(o => o.setName("percentage").setDescription("To what Volume do you want to change").setMaxValue(200).setMinValue(0).setRequired(true))
        .addStringOption(o => o.setName("ignoredecrementer").setDescription("Should the Decrementer be ignored?").setRequired(false).setChoices({ name: "True", value: "true" }, { name: "False", value: "false" })),
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

        if (!player.queue.current) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "I'm not playing anything" });

        await player.setVolume(((interaction.options as CommandInteractionOptionResolver).getInteger("percentage") as number), ((interaction.options as CommandInteractionOptionResolver).getString("ignoredecrementer") as string) === "true");

        await interaction.reply({
            flags: [MessageFlags.Ephemeral], content: `Changed volume to: \`${player.volume}\``
        });
    }
} as Command;
