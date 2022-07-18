const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const noPermission = require('../errors/noPermission.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Remove the bot from the current guild'),
    cooldown: '15',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ embeds: [noPermission] });

        const confirmationEmbed = new MessageEmbed()
            .setTitle('Remove Bot')
            .setDescription('Are you sure you want to remove this bot?')
            .setColor('#ff0000');

        const confirmationButton = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId('confirmed')
                .setLabel('Confirm')
                .setStyle('DANGER'));

            const successEmbed = new MessageEmbed()
                .setDescription('Successfully left the guild. We hope to see you again next time!')
                .setColor(embedColor);

        interaction.reply({ embeds: [confirmationEmbed], components: [confirmationButton] });

            const filter = ft => ft.isButton() && ft.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 30000
            });

            collector.on('collect', co => {
                if (co.customId === 'confirmed') {
                    co.update({ embeds: [successEmbed], components: [] });
                    interaction.guild.leave();
                }
            });

        }
};