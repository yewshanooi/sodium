const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diceroll')
        .setDescription('Roll a dice that contain six sides'),
    cooldown: '3',
    guildOnly: false,
	execute (interaction) {
        const diceRoll = Math.floor(Math.random() * 6 + 1);

        const embed = new EmbedBuilder()
            .setDescription('*Rolling dice..*')
            .setColor(embedColor);
        interaction.reply({ embeds: [embed], fetchReply: true }).then(() => {
            const newEmbed = new EmbedBuilder()
                .setTitle('Dice Roll')
                .setDescription(`<@${interaction.user.id}>, you rolled a **${diceRoll}**!`)
                .setColor(embedColor);
            interaction.editReply({ embeds: [newEmbed] });
        });

    }
};