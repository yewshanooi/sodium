/* eslint-disable no-shadow */

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catfact')
        .setDescription('Gives you a random cat fact'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const fact = await fetch('https://catfact.ninja/fact')
            .then(res => res.json())
            .then(({ fact }) => fact);

            const embed = new MessageEmbed()
                .setTitle('Cat Facts')
                .setDescription(fact)
                .setColor(embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};