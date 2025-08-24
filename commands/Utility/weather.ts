import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    apis: ['OPENWEATHERMAP_API_KEY'],
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get the current weather information for a city')
        .addStringOption(option => option.setName('location').setDescription('Enter a location').setRequired(true)),
    cooldown: 5,
    category: 'Utility',
    guildOnly: false,
    execute: async (client, interaction) => {
        if (!process.env.OPENWEATHERMAP_API_KEY) return interaction.reply({ embeds: [client.errors.noAPIKey] });

        const locationField = interaction.options.getString('location');

        const Weather: any = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locationField}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`)
            .then(res => res.json());

            if (Weather.cod === '404') return interaction.reply({ content: 'Error: No such location found.' });

            const capitalizedDescription = Weather.weather[0].description.charAt(0).toUpperCase() + Weather.weather[0].description.slice(1);

        const embed = new EmbedBuilder()
            .setTitle(`${Weather.name}, ${Weather.sys.country}`)
            .setDescription(`${capitalizedDescription}`)
            .addFields(
				{ name: 'Temperature', value: `\`${Weather.main.temp}\`°C` },
				{ name: 'Humidity', value: `\`${Weather.main.humidity}\`%` },
				{ name: 'Wind Speed', value: `\`${Weather.wind.speed}\` m/s` },
				{ name: 'Wind Direction', value: `\`${Weather.wind.deg}\`°` }
			)
            .setFooter({ text: 'Powered by OpenWeatherMap' })
            .setColor('#ea6e4b');

        return interaction.reply({ embeds: [embed] });
    }
} as Command;