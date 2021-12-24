const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const dotenv = require('dotenv');
    dotenv.config();
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Display the current weather stats')
        .addStringOption(option => option.setName('location').setDescription('Enter a location').setRequired(true)),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const locationField = interaction.options.getString('location');

        const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locationField}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`)
            .then(res => res.json());

            if (weather.cod === '404') return interaction.reply({ content: 'Error: No such location found.' });

            const capitalized = weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1);

        const embed = new MessageEmbed()
            .setTitle(`${weather.name}, ${weather.sys.country}`)
            .setDescription(`${capitalized}`)
            .addFields(
				{ name: 'Temperature', value: `\`${weather.main.temp}\`°C` },
				{ name: 'Humidity', value: `\`${weather.main.humidity}\`%` },
				{ name: 'Wind Speed', value: `\`${weather.wind.speed}\` m/s` },
				{ name: 'Wind Direction', value: `\`${weather.wind.deg}\`°` }
			)
            .setColor(embedColor);

        return interaction.reply({ embeds: [embed] });
    }
};