import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    apis: ['NEWS_API_KEY'],
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Get the latest news from multiple sources')
        .addStringOption(option => option.setName('source').setDescription('Select a news source')
            .addChoices(
                { name: 'ABC News', value: 'abc-news' }, 
                { name: 'Al Jazeera English', value: 'al-jazeera-english' }, 
                { name: 'Ars Technica', value: 'ars-technica' }, 
                { name: 'Associated Press', value: 'associated-press' }, 
                { name: 'Axios', value: 'axios' }, 
                { name: 'BBC News', value: 'bbc-news' }, 
                { name: 'Bloomberg', value: 'bloomberg' }, 
                { name: 'CBS News', value: 'cbs-news' }, 
                { name: 'CNN', value: 'cnn' }, 
                { name: 'Financial Post', value: 'financial-post' }, 
                { name: 'Fortune', value: 'fortune' }, 
                { name: 'IGN', value: 'ign' }, 
                { name: 'National Geographic', value: 'national-geographic' }, 
                { name: 'TechCrunch', value: 'techcrunch' }, 
                { name: 'The Verge', value: 'the-verge' }, 
                { name: 'The Wall Street Journal', value: 'the-wall-street-journal' }, 
                { name: 'The Washington Post', value: 'the-washington-post' },
                { name: 'TIME', value: 'time' },
                { name: 'VICE News', value: 'vice-news' },
                { name: 'Wired', value: 'wired' }
            ).setRequired(true)),
    cooldown: 15,
    category: 'Utility',
    guildOnly: false,
    execute: async (client, interaction) => {
        if (!process.env.NEWS_API_KEY) return interaction.reply({ embeds: [client.errors.noAPIKey] });

        const sourceField = interaction.options.getString('source');

        const News: any = await fetch(`https://newsapi.org/v2/top-headlines?sources=${sourceField}&apiKey=${process.env.NEWS_API_KEY}`)
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

            const buttons = new ActionRowBuilder<ButtonBuilder>();

            News.articles.slice(0, 5).forEach((article, index) => {
                buttons.addComponents(
                    new ButtonBuilder()
                        .setURL(article.url)
                        .setLabel(`Article ${index + 1}`)
                        .setStyle(ButtonStyle.Link)
                );
            });

        return interaction.reply({ embeds: [embed], components: [buttons] });
    }
} as Command;