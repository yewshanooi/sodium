const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play a game of rock, paper and scissors'),
    cooldown: '3',
    guildOnly: false,
    async execute (interaction) {

        const embed = new MessageEmbed()
            .setTitle('Rock Paper Scissors')
            .setDescription('Choose an option')
            .setColor(embedColor);

        const buttonRow = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId('Rock')
                .setLabel('🪨 Rock')
                .setStyle('SECONDARY'))
            .addComponents(new MessageButton()
                .setCustomId('Paper')
                .setLabel('📄 Paper')
                .setStyle('SECONDARY'))
            .addComponents(new MessageButton()
                .setCustomId('Scissors')
                .setLabel('✂️ Scissors')
                .setStyle('SECONDARY'));

        interaction.reply({ embeds: [embed], components: [buttonRow] });

        const message = await interaction.fetchReply();

        const filter = ft => ft.isButton() && ft.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({
            filter,
            max: 1,
            time: 20000
        });

        const choices = ['Rock', 'Paper', 'Scissors'];
        const me = choices[Math.floor(Math.random() * choices.length)];

        collector.on('collect', async collected => {
            if (collected.customId === 'Scissors' && me === 'Rock' || collected.customId === 'Paper' && me === 'Rock' || collected.customId === 'Paper' && me === 'Scissors') {
                const lostEmbed = new MessageEmbed()
                    .setTitle('You Lost!')
                    .addFields(
                        { name: 'Your choice', value: `${collected.customId}` },
                        { name: 'My choice', value: `${me}` }
                    )
                    .setColor(embedColor);
                await collected.update({ embeds: [lostEmbed] });
            }
            else if (collected.customId === me) {
                const tieEmbed = new MessageEmbed()
                    .setTitle('It\'s a tie!')
                    .addFields(
                        { name: 'Your choice', value: `${collected.customId}` },
                        { name: 'My choice', value: `${me}` }
                    )
                    .setColor(embedColor);
                await collected.update({ embeds: [tieEmbed] });
            }
            else {
                const wonEmbed = new MessageEmbed()
                    .setTitle('You won!')
                    .addFields(
                        { name: 'Your choice', value: `${collected.customId}` },
                        { name: 'My choice', value: `${me}` }
                    )
                    .setColor(embedColor);
                await collected.update({ embeds: [wonEmbed] });
                }
            });
        }
};