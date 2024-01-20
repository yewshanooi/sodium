/* eslint-disable no-extra-parens */

const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Search Urban Dictionary for a definition')
        .addStringOption(option => option.setName('query').setDescription('Enter a query').setRequired(true)),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

		const term = interaction.options.getString('query');
		const query = new URLSearchParams({ term });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`)
            .then(res => res.json());

		if (!list.length) return interaction.reply({ content: 'Error: No such definition found.' });

		const [Answer] = list;

            const embed = new EmbedBuilder()
                .setTitle(`${Answer.word}`)
                .addFields(
                    { name: 'Definition', value: `${trim(Answer.definition, 1024)}` },
                    { name: 'Example', value: `${trim(Answer.example, 1024)}` },
                    { name: 'Rating', value: `▲ ${Answer.thumbs_up} ▼ ${Answer.thumbs_down}` }
                )
                .setFooter({ text: 'Powered by Urban Dictionary' })
                .setColor('#1b2936');

                const button = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setURL(`${Answer.permalink}`)
                        .setLabel('View definition')
                        .setStyle('Link'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};

// URLSearchParams() is used to create a query string parameters.