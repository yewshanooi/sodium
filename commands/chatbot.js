const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const noAPIKey = require('../errors/noAPIKey.js');
const dotenv = require('dotenv');
    dotenv.config();
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatbot')
        .setDescription('Chat with an AI developed by BrainShop')
        .addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true)),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const uniqueId = interaction.user.id;
        const queryField = interaction.options.getString('message');

            if (process.env.BRAINSHOP_BID === '') return interaction.reply({ embeds: [noAPIKey], ephemeral: true });
            if (process.env.BRAINSHOP_API_KEY === '') return interaction.reply({ embeds: [noAPIKey], ephemeral: true });

        const Answer = await fetch(`http://api.brainshop.ai/get?bid=${process.env.BRAINSHOP_BID}&key=${process.env.BRAINSHOP_API_KEY}&uid=${uniqueId}&msg=${encodeURIComponent(queryField)}`)
            .then(res => res.json())
            .catch(() => interaction.reply({ content: 'Error: An error has occurred while trying to process your request.' }));

            if (!Answer) return interaction.reply({ content: 'Error: An error has occurred while trying to process your request.' });

        const embed = new EmbedBuilder()
            .setTitle('Aco')
            .setDescription(`${Answer.cnt}`)
            .setFooter({ text: `Powered by BrainShop\nUnique ID: ${uniqueId}` })
            .setColor('#93c24d');

        return interaction.reply({ embeds: [embed] });
    }
};