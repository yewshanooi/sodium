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
        const Color = await fetch('https://colornames.org/random/json/')
            .then(res => res.json());

            const capitalizedName = Color.name.charAt(0).toUpperCase() + Color.name.slice(1);

        const embed = new MessageEmbed()
            .setTitle(`${capitalizedName}`)
            .setDescription(`\`#${Color.hexCode}\``)
            .setColor(`${Color.hexCode}`);

            return interaction.reply({ embeds: [embed] });
        }
};