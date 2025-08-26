import {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    apis: ["GENIUS_API_KEY"],
    gemini: true,
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Get the lyrics for the currently playing song or a specific song.")
        .addStringOption((option) =>
            option.setName("song").setDescription("Enter a song name").setRequired(false)
        ),
    cooldown: 15,
    category: "Music",
    guildOnly: false,
    execute: async (client, interaction) => {
        await interaction.deferReply();

        if (!process.env.GENIUS_API_KEY) {
            return interaction.editReply({ embeds: [global.errors[1]] });
        }

        const player = client.lavalink?.players.get(interaction.guildId!);
        const songTitleOption = interaction.options.getString("song");

        let SongTitle: string | undefined;

        if (songTitleOption) {
            SongTitle = songTitleOption;
        } else if (player?.queue.current) {
            SongTitle = player.queue.current.info.title;
        }

        if (!SongTitle) {
            return interaction.editReply({
                content:
                    "❌ No se está reproduciendo ninguna canción ni has proporcionado un título para buscar.",
            });
        }

        // Limpiar el título de basura típica de YouTube
        const cleanedTitle = SongTitle.replace(
            /\blyrics?\b|\blyrical\b|official music video|\(official.*?\)|audio|feat\.?|prod by|video|extended|hd|\[.*?\]/gi,
            ""
        ).trim();

        // Buscar en Genius
        const res = await fetch(
            `https://api.genius.com/search?q=${encodeURIComponent(
                cleanedTitle
            )}&access_token=${process.env.GENIUS_API_KEY}`
        );

        if (!res.ok) {
            return interaction.editReply({ content: "❌ Error al conectar con Genius API." });
        }

        const json = (await res.json()) as any;
        const hits = json.response?.hits ?? [];

        if (!hits.length) {
            return interaction.editReply({ content: "❌ No se encontraron resultados." });
        }

        const song = hits[0].result;

        const formatNumber = (num: number) =>
            new Intl.NumberFormat("en", { notation: "compact", compactDisplay: "short" }).format(
                num
            );

        const embed = new EmbedBuilder()
            .setTitle(song.title)
            .setDescription(`by ${song.artist_names}`)
            .setImage(song.song_art_image_url)
            .setFooter({ text: "Powered by Genius" })
            .setColor("#ffff64");

        if (song.release_date_with_abbreviated_month_for_display) {
            embed.addFields({
                name: "Release Date",
                value: song.release_date_with_abbreviated_month_for_display,
                inline: true,
            });
        }

        if (song.stats?.concurrents) {
            embed.addFields({
                name: "Viewers",
                value: `${song.stats.hot ? "🔥 " : ""}${formatNumber(song.stats.concurrents)}`,
                inline: true,
            });
        }

        if (song.stats?.pageviews) {
            embed.addFields({
                name: "Total Views",
                value: formatNumber(song.stats.pageviews),
                inline: true,
            });
        }

        const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setURL(song.url).setLabel("View lyrics").setStyle(ButtonStyle.Link)
        );

        return interaction.editReply({ embeds: [embed], components: [button] });
    },
} as Command;
