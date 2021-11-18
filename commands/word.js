const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('word')
        .setDescription('Gives you a random word with its definition and pronunciation'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const word = await fetch('https://random-words-api.vercel.app/word')
            .then(res => res.json());

            const embed = new MessageEmbed()
                .setTitle(`${word[0].word}`)
                .addField('Definition', `${word[0].definition}`)
                .addField('Pronunciation', `${word[0].pronunciation}`)
                .setColor(embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};