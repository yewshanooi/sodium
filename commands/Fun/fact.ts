import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Get a random cat, dog, general, or useless fact')
        .addSubcommand(subcommand => subcommand.setName('cat').setDescription('Get a random cat fact'))
        .addSubcommand(subcommand => subcommand.setName('dog').setDescription('Get a random dog fact'))
        .addSubcommand(subcommand => subcommand.setName('general').setDescription('Get a random general fact'))
        .addSubcommand(subcommand => subcommand.setName('useless').setDescription('Get a random useless fact')),
    cooldown: 5,
    category: 'Fun',
    guildOnly: false,
    execute: async (client, interaction) => {
        await interaction.deferReply();
        let embed;
        // fact cat Subcommand
        if (interaction.options.getSubcommand() === 'cat') {
            const catFact: any = await fetch('https://catfact.ninja/fact')
                .then(res => res.json());

            embed = new EmbedBuilder()
                .setTitle('Cat Fact')
                .setDescription(`${catFact.fact}`)
                .setColor(client.embedColor as any);
        }

        // fact dog Subcommand
        if (interaction.options.getSubcommand() === 'dog') {
            const dogFact: any = await fetch('https://dogapi.dog/api/v2/facts')
                .then(res => res.json());

            embed = new EmbedBuilder()
                .setTitle('Dog Fact')
                .setDescription(`${dogFact.data[0].attributes.body}`)
                .setColor(client.embedColor as any);
        }

        // fact general Subcommand
        if (interaction.options.getSubcommand() === 'general') {
            const generalFact: any = await fetch('https://nekos.life/api/v2/fact')
                .then(res => res.json());

            embed = new EmbedBuilder()
                .setTitle('General Fact')
                .setDescription(`${generalFact.fact}`)
                .setColor(client.embedColor as any);
        }

        // fact useless Subcommand
        if (interaction.options.getSubcommand() === 'useless') {
            const uselessFact: any = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en')
                .then(res => res.json());

            embed = new EmbedBuilder()
                .setTitle('Useless Fact')
                .setDescription(`${uselessFact.text}`)
                .setColor(client.embedColor as any);
        }
        if (process.env.GIPHY_API_KEY) {
            const randomGif = Math.floor(Math.random() * 19);
            const Gif: any = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${encodeURIComponent(interaction.options.getSubcommand())}&limit=1&offset=${randomGif}`
            ).then(res => res.json()).then((body: any) => body.data[0]);

            if (Gif) embed.setThumbnail(Gif.images.original.url);
        }
        return interaction.editReply({ embeds: [embed] });
    }
} as Command;

// .deferReply() is used to ensure that the bot has enough of time to fetch the data.