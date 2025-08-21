const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const pms = require("pretty-ms");
const load = require("lodash");

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the song queue.'),
    
    cooldown: '5',
    category: 'Music',
    guildOnly: true,
    async execute (interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player || !player.queue || player.queue.length === 0) {
            return interaction.reply({ content: 'No music is currently playing in the queue.', ephemeral: true });
        }

        const queuedSongs = player.queue.map((t, i) => `\`${++i}\` • [${t.title}](${t.uri}) • \`[ ${pms(t.duration)} ]\` • ${t.requester}`);
        const mapping = load.chunk(queuedSongs, 10);
        const pages = mapping.map((s) => s.join("\n"));
        let page = 0;

        const generateEmbed = (currentPage) => {
            const currentSong = player.queue.current;
            return new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setDescription(`**Now Playing**\n[${currentSong.title}](${currentSong.uri}) • \`[ ${pms(player.position)} / ${pms(currentSong.duration)} ]\` • ${currentSong.requester}\n\n**Songs in the Queue**\n${pages[currentPage]}`)
                .setTimestamp()
                .setFooter({ text: `Page ${currentPage + 1}/${pages.length}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(currentSong.displayThumbnail("mqdefault"))
                .setTitle(`Music Queue for ${interaction.guild.name}`);
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId("previous").setEmoji("⬅️").setStyle(ButtonStyle.Primary).setDisabled(true),
                new ButtonBuilder().setCustomId("next").setEmoji("➡️").setStyle(ButtonStyle.Primary).setDisabled(pages.length === 1),
                new ButtonBuilder().setCustomId("delete").setEmoji("🗑️").setStyle(ButtonStyle.Danger)
            );

        const msg = await interaction.reply({ embeds: [generateEmbed(page)], components: [row] });

        const collector = msg.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 60000 * 5, // 5 minutos
        });

        collector.on("collect", async i => {
            if (i.customId === "next") {
                page = (page + 1) % pages.length;
                row.components[0].setDisabled(false);
                if (page === pages.length - 1) {
                    row.components[1].setDisabled(true);
                }
            } else if (i.customId === "previous") {
                page = (page - 1 + pages.length) % pages.length;
                row.components[1].setDisabled(false);
                if (page === 0) {
                    row.components[0].setDisabled(true);
                }
            } else if (i.customId === "delete") {
                player.queue.clear();
                return i.update({ content: '🗑️ The queue has been cleared.', embeds: [], components: [] });
            }

            await i.update({ embeds: [generateEmbed(page)], components: [row] });
        });

        collector.on("end", async () => {
            await msg.edit({ components: [] }).catch(() => {});
        });
    },
};