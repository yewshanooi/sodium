const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Get a random fact'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const Fact = await fetch('https://nekos.life/api/v2/fact')
            .then(res => res.json());

            const embed = new MessageEmbed()
                .setTitle('Fact')
                .setDescription(`${Fact.fact}`)
                .setColor(embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};