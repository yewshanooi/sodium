const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play a game of Rock Paper Scissors with the bot'),
    cooldown: '3',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction, configuration) {

        const embed = new EmbedBuilder()
            .setTitle('Rock Paper Scissors')
            .setDescription('Choose an option')
            .setColor(configuration.embedColor);

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Rock')
                    .setLabel('Rock')
                    .setStyle('Secondary'),
                new ButtonBuilder()
                    .setCustomId('Paper')
                    .setLabel('Paper')
                    .setStyle('Secondary'),
                new ButtonBuilder()
                    .setCustomId('Scissors')
                    .setLabel('Scissors')
                    .setStyle('Secondary'));

        interaction.reply({ embeds: [embed], components: [buttons] });

        const message = await interaction.fetchReply();

        const filter = ft => ft.isButton() && ft.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({
            filter,
            max: 1,
            // 15 seconds timeout
            time: 15000
        });

        buttons.components[0].setDisabled(true);
        buttons.components[1].setDisabled(true);
        buttons.components[2].setDisabled(true);

        const choices = ['Rock', 'Paper', 'Scissors'];
        const botOption = choices[Math.floor(Math.random() * choices.length)];

        collector.on('collect', async collected => {
            if (collected.customId === 'Paper' && botOption === 'Rock' || collected.customId === 'Paper' && botOption === 'Scissors' || collected.customId === 'Scissors' && botOption === 'Rock') {
                const userLostEmbed = new EmbedBuilder()
                    .setTitle('You Lost!')
                    .addFields(
                        { name: 'Your choice', value: `${collected.customId}` },
                        { name: 'My choice', value: `${botOption}` }
                    )
                    .setColor(configuration.embedColor);
                await collected.update({ embeds: [userLostEmbed], components: [buttons] }).then(collector.stop());
            } else if (collected.customId === botOption) {
                const tieEmbed = new EmbedBuilder()
                    .setTitle('It\'s a tie!')
                    .addFields(
                        { name: 'Your choice', value: `${collected.customId}` },
                        { name: 'My choice', value: `${botOption}` }
                    )
                    .setColor(configuration.embedColor);
                await collected.update({ embeds: [tieEmbed], components: [buttons] }).then(collector.stop());
            } else {
                const userWonEmbed = new EmbedBuilder()
                    .setTitle('You won!')
                    .addFields(
                        { name: 'Your choice', value: `${collected.customId}` },
                        { name: 'My choice', value: `${botOption}` }
                    )
                    .setColor(configuration.embedColor);
                await collected.update({ embeds: [userWonEmbed], components: [buttons] }).then(collector.stop());
                }
            });

        collector.on('end', async (__, reason) => {
            if (reason === 'time') {
                await interaction.editReply({ embeds: [
                    new EmbedBuilder()
                        .setTitle('Rock Paper Scissors')
                        .setDescription('You took too long! You can try again whenever you want.')
                        .setColor(configuration.embedColor)
                    ], components: [buttons] });
                }
            });

        }
};