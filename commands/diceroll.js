const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diceroll')
        .setDescription('Rolls a dice that contain 6 sides'),
    cooldown: '0',
    guildOnly: false,
	execute (interaction) {
        const rand = Math.floor(Math.random() * 6 + 1);

            const embed = new MessageEmbed()
                .setTitle('Dice Roll')
                .setDescription(`<@${interaction.user.id}>, you rolled a **${rand}**!`)
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] });
        }
};