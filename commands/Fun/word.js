const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('word')
        .setDescription('Get random words')
        .addIntegerOption(option => option.setName('amount').setDescription('Enter an amount (between 1 and 10)').setMinValue(1).setMaxValue(10).setRequired(true)),
    cooldown: '3',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction, client) {
        const amountField = interaction.options.getInteger('amount');

        const Word = await fetch(`https://random-word-api.vercel.app/api?words=${amountField}&type=capitalized`)
            .then(res => res.json());

            const wordList = Word.join('\n');

            const embed = new EmbedBuilder()
                .setDescription(wordList)
                .setColor(client.config.embedColor);

            if (amountField === 1) {
                embed.setTitle('Word');
            } else {
                embed.setTitle('Words');
            }

            return interaction.reply({ embeds: [embed] });
        }
};