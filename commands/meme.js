const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const url1 = 'https://www.reddit.com/r/meme.json?sort=top&t=week';
const url2 = 'https://www.reddit.com/r/memes.json?sort=top&t=week';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get fresh and new memes from Reddit'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const links = [url1, url2];
        const randomLinks = links[Math.floor(Math.random() * links.length)];

        const memes = await fetch(randomLinks)
            .then(res => res.json());

        const getMemes = memes.data.children;
        const randomMemes = getMemes[Math.floor(Math.random() * getMemes.length)];

        const memeEmbed = new MessageEmbed()
            .setTitle('Meme')
            .setDescription(`${randomMemes.data.title}`)
            .setImage(`${randomMemes.data.url}`)
            .setFooter({ text: 'Powered by Reddit' })
            .setColor('#ff4500');

        return interaction.reply({ embeds: [memeEmbed] });
    }
};