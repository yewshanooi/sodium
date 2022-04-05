const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diceroll')
        .setDescription('Roll a dice that contain six sides'),
    cooldown: '3',
    guildOnly: false,
	execute (interaction) {
        const diceRoll = Math.floor(Math.random() * 6 + 1);

            const embed = new MessageEmbed()
                .setTitle('Dice Roll')
                .setDescription(`<@${interaction.user.id}>, you rolled a **${diceRoll}**!`)
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] });
        }
};