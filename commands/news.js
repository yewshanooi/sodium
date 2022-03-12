const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
	dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Get the latest news from different sources')
        .addStringOption(option => option.setName('source').setDescription('Select a news source').addChoice('Al Jazeera English', 'al-jazeera-english').addChoice('BBC News', 'bbc-news').addChoice('CBS News', 'cbs-news').addChoice('CNN', 'cnn').addChoice('Reuters', 'reuters').addChoice('The Verge', 'the-verge').addChoice('The Wall Street Journal', 'the-wall-street-journal').addChoice('The Washington Post', 'the-washington-post').setRequired(true)),
    cooldown: '15',
    guildOnly: false,
    async execute (interaction) {
        const sourceField = interaction.options.getString('source');

        const news = await fetch(`https://newsapi.org/v2/top-headlines?sources=${sourceField}&apiKey=${process.env.NEWS_API_KEY}`)
            .then(res => res.json());

            if (news.status === 'error') return interaction.reply({ content: 'Error: There was an error trying to get the latest news.' });

        const embed = new MessageEmbed()
            .setTitle('News')
            .addFields(
                { name: `1. ${news.articles[0].title}`, value: `${news.articles[0].description}` },
                { name: `2. ${news.articles[1].title}`, value: `${news.articles[1].description}` },
                { name: `3. ${news.articles[2].title}`, value: `${news.articles[2].description}` },
                { name: `4. ${news.articles[3].title}`, value: `${news.articles[3].description}` },
                { name: `5. ${news.articles[4].title}`, value: `${news.articles[4].description}` }
            )
            .setFooter({ text: 'Powered by NewsAPI' })
            .setColor('#1a73e8');

            const buttons = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL(news.articles[0].url)
                    .setLabel('Article 1')
                    .setStyle('LINK'))
                .addComponents(new MessageButton()
                    .setURL(news.articles[1].url)
                    .setLabel('Article 2')
                    .setStyle('LINK'))
                .addComponents(new MessageButton()
                    .setURL(news.articles[2].url)
                    .setLabel('Article 3')
                    .setStyle('LINK'))
                .addComponents(new MessageButton()
                    .setURL(news.articles[3].url)
                    .setLabel('Article 4')
                    .setStyle('LINK'))
                .addComponents(new MessageButton()
                    .setURL(news.articles[4].url)
                    .setLabel('Article 5')
                    .setStyle('LINK'));

        return interaction.reply({ embeds: [embed], components: [buttons] });
    }
};