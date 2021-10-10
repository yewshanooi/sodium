/* eslint-disable no-extra-parens */
/* eslint-disable no-ternary */
/* eslint-disable multiline-ternary */

const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Search Urban Dictionary for a definition')
        .addStringOption(option => option.setName('query').setDescription('Enter a query').setRequired(true)),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

		const term = interaction.options.getString('query');
		const query = new URLSearchParams({ term });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

		if (!list.length) {
			return interaction.reply(`Error: No results found for **${term}**.`);
		}

		const [answer] = list;

            const embed = new MessageEmbed()
                .setTitle(answer.word)
                .addFields(
                    { name: 'Definition', value: `${trim(answer.definition, 1024)}` },
                    { name: 'Example', value: `${trim(answer.example, 1024)}` },
                    { name: 'Rating', value: `${answer.thumbs_up} ▲ ${answer.thumbs_down} ▼` }
                )
                .setColor(embedColor);

                const button = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setURL(answer.permalink)
                        .setLabel('More Definitions')
                        .setStyle('LINK'));

            interaction.reply({ embeds: [embed], components: [button] });
        }
};