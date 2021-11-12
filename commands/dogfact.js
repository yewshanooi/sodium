const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dogfact')
        .setDescription('Gives you a random dog fact'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const fact = await fetch('http://dog-api.kinduff.com/api/facts?number=1')
            .then(res => res.json())
            .then(body => body.facts[0]);

            const embed = new MessageEmbed()
                .setTitle('Dog Fact')
                .setDescription(fact)
                .setColor(embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};