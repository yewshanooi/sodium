const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
    dotenv.config();
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nasa')
        .setDescription('Get an Astronomy Picture of the Day from NASA'),
    cooldown: '25',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        if (!process.env.NASA_API_KEY) return interaction.reply({ embeds: [global.errors[1]], ephemeral: true });

        const Nasa = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
            .then(res => res.json());

        if (!Nasa.explanation) return interaction.reply({ content: 'Error: An error has occurred while trying to get the image.' });

        const embed = new EmbedBuilder()
            .setTitle(`${Nasa.title}`)
            .setDescription(`${Nasa.explanation}`)
            .setImage(`${Nasa.url}`)
            .setFooter({ text: 'Powered by NASA' })
            .setColor('#033a92');

            const button = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setURL(`${Nasa.hdurl}`)
                    .setLabel('Image source')
                    .setStyle('Link'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};