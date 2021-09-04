const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Get a random fact from nekos.life'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const { fact } = await fetch('https://nekos.life/api/v2/fact')
            .then(res => res.json());

        const embedFact = new MessageEmbed()
            .setTitle('Fact')
            .setDescription(fact)
            .setColor(embedColor);

        return interaction.reply({ embeds: [embedFact] });
    }
};