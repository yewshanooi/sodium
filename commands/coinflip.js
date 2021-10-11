const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a two sided coin for you'),
    cooldown: '5',
    guildOnly: false,
    execute (interaction) {
        const flip = Math.floor(Math.random() * 2);
        let result;
            if (flip === 1) result = 'heads';
            else result = 'tails';

        const embed = new MessageEmbed()
            .setTitle('Coin Flip')
            .setDescription(`I flipped a coin for you, <@${interaction.user.id}>!\n It was **${result}**`)
            .setColor(embedColor);
        interaction.reply({ embeds: [embed] });
	}
};