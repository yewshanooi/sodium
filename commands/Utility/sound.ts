import {
    SlashCommandBuilder,
    MessageFlags,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType
} from "discord.js";

import type { CommandInteractionOptionResolver, GuildMember, VoiceChannel } from "discord.js";
import type { Command } from "../../Utils/types/Client";

const fetch = require("node-fetch").default;

const myInstantsAPI = "https://myinstants-api.vercel.app";

export default {
    data: new SlashCommandBuilder()
        .setName("sound")
        .setDescription("Search and play a sound from MyInstants.")
        .addStringOption(option =>
            option.setName("keyword")
                .setDescription("The keyword to search for a sound.")
                .setRequired(false)
        )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The voice channel you want the bot to join.")
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(false)
        ),
    cooldown: 10,
    category: "Utility",
    guildOnly: true,

    execute: async (client, interaction) => {
        if (!interaction.guildId) return;

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const memberVC = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel | null;
        const targetVC = interaction.options.getChannel("channel") as VoiceChannel | null;

        let voiceChannelToJoin: VoiceChannel | null = null;

        if (targetVC) {
            if (targetVC.members.size > 0) {
                voiceChannelToJoin = targetVC;
            } else {
                return interaction.editReply({
                    content: "⚠️ The specified voice channel is empty. Join it or pick one with members."
                });
            }
        } else if (memberVC) {
            voiceChannelToJoin = memberVC;
        } else {
            return interaction.editReply({
                content: "⚠️ You must be in a voice channel to use this command!"
            });
        }

        const query = (interaction.options as CommandInteractionOptionResolver).getString("keyword");
        let apiUrl: string;

        try {
            apiUrl = query
                ? `${myInstantsAPI}/search?q=${encodeURIComponent(query)}`
                : `${myInstantsAPI}/trending?q=us`;

            const response = await fetch(apiUrl);
            const apiData = await response.json();

            if (response.status !== 200 || !apiData.data || apiData.data.length === 0) {
                return interaction.editReply({
                    content: "🤷‍♂️ No sounds found matching your search."
                });
            }

            const results = apiData.data.slice(0, 5);
            const description = results
                .map((sound: any, idx: number) => `${idx + 1}. **[${sound.title}](${sound.mp3})**`)
                .join("\n");

            const embed = new EmbedBuilder()
                .setTitle("🎶 Search Results")
                .setDescription(description)
                .setColor("Random")
                .setFooter({ text: "Click a button to add the sound to the queue. (30s)" });

            const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
                ...results.map((_: any, index: number) =>
                    new ButtonBuilder()
                        .setCustomId(`sound_select_${index}_${interaction.id}`)
                        .setLabel(`${index + 1}`)
                        .setStyle(ButtonStyle.Primary)
                )
            );

            const responseMessage = await interaction.editReply({
                embeds: [embed],
                components: [buttons]
            });

            const collector = responseMessage.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id && i.customId.startsWith("sound_select_"),
                time: 30000
            });

            collector.on("collect", async i => {
                await i.deferUpdate();

                const selectedIndex = parseInt(i.customId.split("_")[2]);
                const selectedSound = results[selectedIndex];

                try {
                    const player = await client.lavalink.createPlayer({
                        guildId: interaction.guildId!,
                        voiceChannelId: voiceChannelToJoin!.id,
                        textChannelId: interaction.channelId,
                        selfDeaf: true,
                        selfMute: false,
                        volume: 100
                    });

                    if (!player.connected) await player.connect();
                    if (player.voiceChannelId !== voiceChannelToJoin!.id) {
                        return i.followUp({
                            content: "⚠️ You must be in the same voice channel as me.",
                            flags: [MessageFlags.Ephemeral]
                        });
                    }

                    const res = await player.search(selectedSound.mp3, interaction.user);

                    if (!res || !res.tracks?.length) {
                        return i.followUp({
                            content: "❌ Could not retrieve the audio. Try again.",
                            flags: [MessageFlags.Ephemeral]
                        });
                    }

                    const track: any = res.tracks[0];
                    track.title = selectedSound.title;
                    track.uri = selectedSound.mp3;
                    track.author = selectedSound.author || "MyInstants";
                    track.requester = interaction.user;
                    track.info.title = selectedSound.title;
                    track.info.uri = selectedSound.mp3;
                    track.info.author = selectedSound.author || "MyInstants";

                    player.queue.add(track);

                    if (!player.playing) {
                        await player.play({ volume: client.defaultVolume, paused: false });
                    }

                    const confirmEmbed = new EmbedBuilder()
                        .setColor("Random")
                        .setDescription(`🎶 **Added to queue:** \`${selectedSound.title}\``);

                    await i.followUp({ embeds: [confirmEmbed], flags: [MessageFlags.Ephemeral] });

                } catch (err: any) {
                    console.error(err);
                    await i.followUp({
                        content: `❌ Error while processing: ${err.message}`,
                        flags: [MessageFlags.Ephemeral]
                    });
                }
            });

            collector.on("end", async (_, reason) => {
                if (reason === "time") {
                    const expiredEmbed = new EmbedBuilder()
                        .setDescription("⏳ Time to select a sound has expired.")
                        .setColor("Grey");

                    try {
                        await interaction.editReply({ embeds: [expiredEmbed], components: [] });
                    } catch {
                        console.log("Message already updated or expired.");
                    }
                }
            });
        } catch (error) {
            console.error(error);
            return interaction.editReply({
                content: "❌ An error occurred while contacting MyInstants API.",
            });
        }
    }
} as Command;
