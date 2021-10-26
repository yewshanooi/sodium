const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Remove the bot from the current guild'),
    cooldown: '45',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

        const confirmation = new MessageEmbed()
            .setTitle('Leave')
            .setDescription('Are you sure you want to remove this bot?')
            .setColor('#FF0000');

        const leaveButton = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId('leaveBtn')
                .setLabel('Leave Guild')
                .setStyle('DANGER'));

            const confirmed = new MessageEmbed()
                .setTitle('Leave')
                .setDescription('Successfully left the guild.\n We hope to see you again next time!')
                .setColor(embedColor);

            const successButton = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL('https://skyebot.weebly.com')
                    .setLabel('Already missed us? Invite us back')
                    .setStyle('LINK'));

        interaction.reply({ embeds: [confirmation], components: [leaveButton] });

            const filter = ft => ft.isButton() && ft.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 15000
            });

            collector.on('collect', co => {
                if (co.customId === 'leaveBtn') {
                    interaction.guild.leave().then(co.update({ embeds: [confirmed], components: [successButton] }));
                }
            });

        }
};