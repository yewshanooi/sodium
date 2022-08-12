const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const url1 = 'https://www.reddit.com/r/meme.json?sort=top&t=week';
const url2 = 'https://www.reddit.com/r/memes.json?sort=top&t=week';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get fresh and new memes from Reddit'),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        const links = [url1, url2];
        const randomLinks = links[Math.floor(Math.random() * links.length)];

        const Memes = await fetch(randomLinks)
            .then(res => res.json());

        const fetchData = Memes.data.children;
        const randomMemes = fetchData[Math.floor(Math.random() * fetchData.length)];

            const embed = new EmbedBuilder()
                .setTitle('Meme')
                .setDescription(`${randomMemes.data.title}`)
                .setImage(`${randomMemes.data.url}`)
                .setFooter({ text: 'Powered by Reddit' })
                .setColor('#ff4500');

            return interaction.reply({ embeds: [embed] });
        }
};