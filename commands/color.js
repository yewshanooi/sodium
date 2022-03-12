const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Get a random color'),
    cooldown: '3',
    guildOnly: false,
    async execute (interaction) {
        const color = await fetch('https://colornames.org/random/json/')
            .then(res => res.json());

            const capitalized = color.name.charAt(0).toUpperCase() + color.name.slice(1);

        const embed = new MessageEmbed()
            .setTitle(`${capitalized}`)
            .setDescription(`\`#${color.hexCode}\``)
            .setColor(`${color.hexCode}`);

            return interaction.reply({ embeds: [embed] });
        }
};