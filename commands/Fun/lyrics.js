const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Get a song\'s lyrics from Genius')
        .addStringOption(option => option.setName('song').setDescription('Enter a song name').setRequired(true)),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        await interaction.deferReply();

        if (!process.env.GENIUS_API_KEY) return interaction.editReply({ embeds: [global.errors[1]] });

        const songField = interaction.options.getString('song');

        const Song = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(songField)}&access_token=${process.env.GENIUS_API_KEY}`)
            .then(res => res.json())
            .then(body => body.response.hits);

            if (!Song.length) return interaction.editReply({ content: 'Error: No results found.' });

            const formatNumber = function (num) {
                const nb = new Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' });
                return nb.format(num);
            };

        const embed = new EmbedBuilder()
            .setTitle(`${Song[0].result.title}`)
            .setDescription(`by ${Song[0].result.artist_names}`)
            .setImage(`${Song[0].result.song_art_image_url}`)
            .setFooter({ text: 'Powered by Genius' })
            .setColor('#ffff64');

            if (Song[0].result.release_date_with_abbreviated_month_for_display) embed.addFields({ name: 'Release Date', value: `${Song[0].result.release_date_with_abbreviated_month_for_display}`, inline: true });

            if (Song[0].result.stats.concurrents) {
                if (Song[0].result.stats.hot === true) {
                    embed.addFields({ name: 'Viewers', value: `🔥 ${formatNumber(Song[0].result.stats.concurrents)}`, inline: true });
                } else {
                    embed.addFields({ name: 'Viewers', value: `${formatNumber(Song[0].result.stats.concurrents)}`, inline: true });
                }
            }

            if (Song[0].result.stats.pageviews) embed.addFields({ name: 'Total Views', value: `${formatNumber(Song[0].result.stats.pageviews)}`, inline: true });

            const button = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setURL(`${Song[0].result.url}`)
                    .setLabel('View lyrics')
                    .setStyle('Link'));

            return interaction.editReply({ embeds: [embed], components: [button] });
        }
};