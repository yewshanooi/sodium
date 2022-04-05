const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
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

        const embed = new MessageEmbed()
            .setTitle('Coin Flip')
            .setDescription(`${interaction.member} flipped **${resultCoinFlip}**`)
            .setColor(embedColor);
        interaction.reply({ embeds: [embed] });
	}
};