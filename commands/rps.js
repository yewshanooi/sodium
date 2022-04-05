const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play a game of Rock Paper Scissors with the bot'),
    cooldown: '3',
    guildOnly: false,
    async execute (interaction) {

        const embed = new MessageEmbed()
            .setTitle('Rock Paper Scissors')
            .setDescription('Choose an option')
            .setColor(embedColor);

        const buttons = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId('Rock')
                .setLabel('Rock')
                .setStyle('SECONDARY'))
            .addComponents(new MessageButton()
                .setCustomId('Paper')
                .setLabel('Paper')
                .setStyle('SECONDARY'))
            .addComponents(new MessageButton()
                .setCustomId('Scissors')
                .setLabel('Scissors')
                .setStyle('SECONDARY'));

        interaction.reply({ embeds: [embed], components: [buttons] });

        const message = await interaction.fetchReply();

        const filter = ft => ft.isButton() && ft.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({
            filter,
            max: 1,
            time: 20000
        });

        const choices = ['Rock', 'Paper', 'Scissors'];
        const botOption = choices[Math.floor(Math.random() * choices.length)];

        collector.on('collect', async collected => {
            if (collected.customId === 'Scissors' && botOption === 'Rock' || collected.customId === 'Paper' && botOption === 'Rock' || collected.customId === 'Paper' && botOption === 'Scissors') {
                const userLostEmbed = new MessageEmbed()
                    .setTitle('You Lost!')
                    .addFields(
                        { name: 'Your choice', value: `${collected.customId}` },
                        { name: 'My choice', value: `${botOption}` }
                    )
                    .setColor(embedColor);
                await collected.update({ embeds: [userLostEmbed] }).then(collector.stop());
            }
            else if (collected.customId === botOption) {
                const tieEmbed = new MessageEmbed()
                    .setTitle('It\'s a tie!')
                    .addFields(
                        { name: 'Your choice', value: `${collected.customId}` },
                        { name: 'My choice', value: `${botOption}` }
                    )
                    .setColor(embedColor);
                await collected.update({ embeds: [tieEmbed] }).then(collector.stop());
            }
            else {
                const userWonEmbed = new MessageEmbed()
                    .setTitle('You won!')
                    .addFields(
                        { name: 'Your choice', value: `${collected.customId}` },
                        { name: 'My choice', value: `${botOption}` }
                    )
                    .setColor(embedColor);
                await collected.update({ embeds: [userWonEmbed] }).then(collector.stop());
                }
            });

        }
};