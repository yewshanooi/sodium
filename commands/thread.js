const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thread')
        .setDescription('Start a new thread')
        .addStringOption(option => option.setName('name').setDescription('Enter a thread name').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Select an auto archive duration').setRequired(true).addChoice('1 Hour', 60).addChoice('24 Hours', 1440)),
    cooldown: '10',
    guildOnly: true,
    async execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_THREADS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_THREADS** permission in `Server settings > Roles > Skye > Permissions` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_THREADS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

            const nameField = interaction.options.getString('name');

            const durationField = interaction.options.getInteger('duration');

                let resultDuration;
                    if (durationField === 60) resultDuration = '1 Hour';
                    if (durationField === 1440) resultDuration = '24 Hours';

                const thread = await interaction.channel.threads.create({
                    name: nameField,
                    autoArchiveDuration: durationField
                });

        const embed = new MessageEmbed()
            .setTitle('Thread')
            .addField('Name', `${thread.name}`)
            .addField('Archive After', `\`${resultDuration}\``)
            .setTimestamp()
            .setColor(embedColor);

        interaction.reply({ embeds: [embed] });
    }
};