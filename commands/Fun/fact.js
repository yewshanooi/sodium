const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Get a random cat, dog, general, or useless fact')
        .addSubcommand(subcommand => subcommand.setName('cat').setDescription('Get a random cat fact'))
        .addSubcommand(subcommand => subcommand.setName('dog').setDescription('Get a random dog fact'))
        .addSubcommand(subcommand => subcommand.setName('general').setDescription('Get a random general fact'))
        .addSubcommand(subcommand => subcommand.setName('useless').setDescription('Get a random useless fact')),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction, configuration) {
        await interaction.deferReply();

        // fact cat Subcommand
        if (interaction.options.getSubcommand() === 'cat') {
            const catFact = await fetch('https://catfact.ninja/fact')
                .then(res => res.json());

            const catEmbed = new EmbedBuilder()
                .setTitle('Cat Fact')
                .setDescription(`${catFact.fact}`)
                .setColor(configuration.embedColor);

            return interaction.editReply({ embeds: [catEmbed] });
        }

        // fact dog Subcommand
        if (interaction.options.getSubcommand() === 'dog') {
            const dogFact = await fetch('https://dogapi.dog/api/v2/facts')
                .then(res => res.json());

            const dogEmbed = new EmbedBuilder()
                .setTitle('Dog Fact')
                .setDescription(`${dogFact.data[0].attributes.body}`)
                .setColor(configuration.embedColor);

            return interaction.editReply({ embeds: [dogEmbed] });
        }

        // fact general Subcommand
        if (interaction.options.getSubcommand() === 'general') {
            const generalFact = await fetch('https://nekos.life/api/v2/fact')
                .then(res => res.json());

            const generalEmbed = new EmbedBuilder()
                .setTitle('General Fact')
                .setDescription(`${generalFact.fact}`)
                .setColor(configuration.embedColor);

            return interaction.editReply({ embeds: [generalEmbed] });
        }

        // fact useless Subcommand
        if (interaction.options.getSubcommand() === 'useless') {
            const uselessFact = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en')
                .then(res => res.json());

            const uselessEmbed = new EmbedBuilder()
                .setTitle('Useless Fact')
                .setDescription(`${uselessFact.text}`)
                .setColor(configuration.embedColor);

            return interaction.editReply({ embeds: [uselessEmbed] });
        }

    }
};

// .deferReply() is used to ensure that the bot has enough of time to fetch the data.