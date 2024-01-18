const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Get a random anime girl image from Pixiv'),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        const Anime = await fetch('https://nekos.best/api/v2/neko')
            .then(res => res.json());

        const embed = new EmbedBuilder()
            .setTitle('Waifu')
            .setImage(`${Anime.results[0].url}`)
            .setFooter({ text: `Artist: ${Anime.results[0].artist_name}\nPowered by Pixiv` })
            .setColor('#009dff');

            const buttons = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setURL(`${Anime.results[0].artist_href}`)
                    .setLabel('View artist')
                    .setStyle('Link'))
                .addComponents(new ButtonBuilder()
                    .setURL(`${Anime.results[0].source_url}`)
                    .setLabel('View source')
                    .setStyle('Link'));

            return interaction.reply({ embeds: [embed], components: [buttons] });
        }
};