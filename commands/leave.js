const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Remove the bot from the current guild'),
    cooldown: '15',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

        const confirmEmbed = new MessageEmbed()
            .setTitle('Remove Bot')
            .setDescription('Are you sure you want to remove this bot?')
            .setColor('#FF0000');

        const confirmButton = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId('confirmed')
                .setLabel('Confirm')
                .setStyle('DANGER'));

            const successEmbed = new MessageEmbed()
                .setDescription('*Successfully left the guild. We hope to see you again next time!*')
                .setColor(embedColor);

            const successButton = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL('https://skyebot.weebly.com')
                    .setLabel('Already missed us? Invite us back')
                    .setStyle('LINK'));

        interaction.reply({ embeds: [confirmEmbed], components: [confirmButton] });

            const filter = ft => ft.isButton() && ft.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 30000
            });

            collector.on('collect', co => {
                if (co.customId === 'confirmed') {
                    co.update({ embeds: [successEmbed], components: [successButton] });
                    interaction.guild.leave();
                }
            });

        }
};