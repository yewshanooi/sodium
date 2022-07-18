const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const noAPIKey = require('../errors/noAPIKey.js');
const dotenv = require('dotenv');
    dotenv.config();
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nasa')
        .setDescription('Get an Astronomy Picture of the Day from NASA'),
    cooldown: '25',
    guildOnly: false,
    async execute (interaction) {
        if (process.env.NASA_API_KEY === '') return interaction.reply({ embeds: [noAPIKey], ephemeral: true });

        const Nasa = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
            .then(res => res.json());

        if (!Nasa.explanation) return interaction.reply({ content: 'Error: An error has occurred while trying to get the image.' });

        const embed = new MessageEmbed()
            .setTitle(`${Nasa.title}`)
            .setDescription(`${Nasa.explanation}`)
            .setImage(`${Nasa.url}`)
            .setFooter({ text: `Copyright ©${Nasa.copyright}\nPowered by NASA` })
            .setColor('#033a92');

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL(`${Nasa.hdurl}`)
                    .setLabel('Image source')
                    .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};