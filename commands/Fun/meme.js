const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

const subreddits = [
    'meme',
    'memes',
    'dankmemes',
    'wholesomememes'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('View the latest memes from Reddit'),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        const randomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

        const Memes = await fetch(`https://www.reddit.com/r/${randomSubreddit}.json`)
            .then(res => res.json());

        const fetchData = Memes.data.children;
        const randomMemes = fetchData[Math.floor(Math.random() * fetchData.length)];

            const embed = new EmbedBuilder()
                .setTitle('Meme')
                .setDescription(`${randomMemes.data.title}`)
                .setImage(`${randomMemes.data.url}`)
                .setFooter({ text: `Posted in r/${randomSubreddit}\nPowered by Reddit` })
                .setColor('#ff4500');

            return interaction.reply({ embeds: [embed] });
        }
};