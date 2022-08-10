const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('diceroll')
        .setDescription('Roll a dice that contain six sides'),
    cooldown: '3',
    guildOnly: false,
	execute (interaction, configuration, errors) {
        const diceRoll = Math.floor(Math.random() * 6 + 1);

        const embed = new EmbedBuilder()
            .setDescription('*Rolling dice..*')
            .setColor(configuration.embedColor);
        interaction.reply({ embeds: [embed], fetchReply: true }).then(() => {
            const newEmbed = new EmbedBuilder()
                .setTitle('Dice Roll')
                .setDescription(`<@${interaction.user.id}>, you rolled a **${diceRoll}**!`)
                .setColor(configuration.embedColor);
            interaction.editReply({ embeds: [newEmbed] });
        });

    }
};