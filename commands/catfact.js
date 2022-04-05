const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catfact')
        .setDescription('Get a random cat fact'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const Fact = await fetch('https://catfact.ninja/fact')
            .then(res => res.json());

            const embed = new MessageEmbed()
                .setTitle('Cat Fact')
                .setDescription(`${Fact.fact}`)
                .setColor(embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};