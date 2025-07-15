const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Get the latest news from multiple sources')
        .addStringOption(option => option.setName('source').setDescription('Select a news source').addChoices({ name: 'Al Jazeera English', value: 'al-jazeera-english' }, { name: 'BBC News', value: 'bbc-news' }, { name: 'CBS News', value: 'cbs-news' }, { name: 'CNN', value: 'cnn' }, { name: 'Reuters', value: 'reuters' }, { name: 'The Verge', value: 'the-verge' }, { name: 'The Wall Street Journal', value: 'the-wall-street-journal' }, { name: 'The Washington Post', value: 'the-washington-post' }).setRequired(true)),
    cooldown: '15',
    category: 'Utility',
    guildOnly: false,
    async execute (interaction) {
        if (!process.env.NEWS_API_KEY) return interaction.reply({ embeds: [global.errors[1]] });

        const sourceField = interaction.options.getString('source');

        const News = await fetch(`https://newsapi.org/v2/top-headlines?sources=${sourceField}&apiKey=${process.env.NEWS_API_KEY}`)
            .then(res => res.json());

            if (News.status === 'error') return interaction.reply({ content: 'Error: There was an error getting the latest news.' });
            if (News.articles.length === 0) return interaction.reply({ content: 'Error: The selected source doesn\'t have any article.' });

        const embed = new EmbedBuilder()
            .setTitle('News')
            .addFields(
                { name: `1. ${News.articles[0].title}`, value: `${News.articles[0].description}` },
                { name: `2. ${News.articles[1].title}`, value: `${News.articles[1].description}` },
                { name: `3. ${News.articles[2].title}`, value: `${News.articles[2].description}` },
                { name: `4. ${News.articles[3].title}`, value: `${News.articles[3].description}` },
                { name: `5. ${News.articles[4].title}`, value: `${News.articles[4].description}` }
            )
            .setFooter({ text: 'Powered by NewsAPI' })
            .setColor('#1a73e8');

            const buttons = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setURL(News.articles[0].url)
                    .setLabel('Article 1')
                    .setStyle('Link'))
                .addComponents(new ButtonBuilder()
                    .setURL(News.articles[1].url)
                    .setLabel('Article 2')
                    .setStyle('Link'))
                .addComponents(new ButtonBuilder()
                    .setURL(News.articles[2].url)
                    .setLabel('Article 3')
                    .setStyle('Link'))
                .addComponents(new ButtonBuilder()
                    .setURL(News.articles[3].url)
                    .setLabel('Article 4')
                    .setStyle('Link'))
                .addComponents(new ButtonBuilder()
                    .setURL(News.articles[4].url)
                    .setLabel('Article 5')
                    .setStyle('Link'));

        return interaction.reply({ embeds: [embed], components: [buttons] });
    }
};