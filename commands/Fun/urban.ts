import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Search Urban Dictionary for a definition')
        .addStringOption(option => option.setName('query').setDescription('Enter a query').setRequired(true)),
    cooldown: 5,
    category: 'Fun',
    guildOnly: false,
	execute: async (client, interaction) => {
        await interaction.deferReply();

        const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

        const term = interaction.options.getString('query');
        const query = new URLSearchParams({ term });

        try {
            const response: any = await fetch(`https://api.urbandictionary.com/v0/define?${query}`);
            const data = await response.json();

            if (data.error) return interaction.editReply({ content: 'Error: An error has occurred while trying to process your request.' });

            const { list } = data;

            if (!list.length) return interaction.editReply({ content: 'Error: No such definition found.' });

            const [Answer] = list;

            const embed = new EmbedBuilder()
                .setTitle(`${Answer.word}`)
                .setAuthor({
						name: 'Urban Dictionary',
						url: 'https://urbandictionary.com',
						iconURL: 'https://i.imgur.com/vdoosDm.png'
				})
                .setFooter({ text: 'Powered by Urban Dictionary' })
                .setColor('#1b2936');

                if (Answer.definition) embed.addFields({ name: 'Definition', value: `${trim(Answer.definition, 1024)}` });
                if (Answer.example) embed.addFields({ name: 'Example', value: `${trim(Answer.example, 1024)}` });

                //embed.addFields({ name: 'Rating', value: `▲ ${Answer.thumbs_up} ▼ ${Answer.thumbs_down}` });

            const button = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(new ButtonBuilder()
                    .setURL(`${Answer.permalink}`)
                    .setLabel('View definition')
                    .setStyle(ButtonStyle.Link));

            return interaction.editReply({ embeds: [embed], components: [button] });
        } catch (err) {
            console.error(err);
            return interaction.editReply('Error: An error has occurred while processing your request.');
        }
    }
} as Command;