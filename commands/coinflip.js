const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a two sided coin for you'),
    cooldown: '3',
    guildOnly: false,
    execute (interaction) {
        const flip = Math.floor(Math.random() * 2);
        let resultFlip;
            if (flip === 1) resultFlip = 'heads';
            else resultFlip = 'tails';

        const embed = new MessageEmbed()
            .setTitle('Coin Flip')
            .setDescription(`${interaction.member} flipped **${resultFlip}**`)
            .setColor(embedColor);
        interaction.reply({ embeds: [embed] });
	}
};