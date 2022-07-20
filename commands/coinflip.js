const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a two-sided coin'),
    cooldown: '3',
    guildOnly: false,
    execute (interaction) {
        const coinFlip = Math.floor(Math.random() * 2);
        let resultCoinFlip;
            if (coinFlip === 1) resultCoinFlip = 'heads';
            else resultCoinFlip = 'tails';

        const embed = new EmbedBuilder()
            .setDescription('*Flipping coin..*')
            .setColor(embedColor);
        interaction.reply({ embeds: [embed], fetchReply: true }).then(() => {
            const newEmbed = new EmbedBuilder()
                .setTitle('Coin Flip')
                .setDescription(`${interaction.member} flipped **${resultCoinFlip}**`)
                .setColor(embedColor);
            interaction.editReply({ embeds: [newEmbed] });
        });

	}
};