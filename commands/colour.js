const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('colour')
        .setDescription('Get a random colour from colornames.org'),
    cooldown: '3',
    guildOnly: false,
    async execute (interaction) {
        const colour = await fetch('https://colornames.org/random/json/')
            .then(res => res.json());

            const capitalized = colour.name.charAt(0).toUpperCase() + colour.name.slice(1);

        const embed = new MessageEmbed()
            .setTitle(`${capitalized}`)
            .setDescription(`\`#${colour.hexCode}\``)
            .setColor(`${colour.hexCode}`);

        return interaction.reply({ embeds: [embed] })
            .catch(() => {});
        }
};

// error: temporary fix is by using .catch to prevent the bot from crashing (Unknown interaction, code: 10062, httpStatus: 404)