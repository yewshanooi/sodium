const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thcreate')
        .setDescription('Create a new thread')
        .addStringOption(option => option.setName('threadname').setDescription('Enter a thread name').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Enter an auto archive duration').setRequired(true)),
    cooldown: '25',
    guildOnly: true,
    async execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_THREADS')) return interaction.reply('Error: Bot permission denied. Enable **MANAGE_THREADS** permission in `Server settings > Roles > Skye > Permissions` to use this command.');
        if (!interaction.member.permissions.has('MANAGE_THREADS')) return interaction.reply('Error: You have no permission to use this command.');

            const nameField = interaction.options.getString('threadname');

            const durationField = interaction.options.getInteger('duration');
            let resultDuration;
                if (durationField === 60) resultDuration = '1 Hour';
                if (durationField === 1440) resultDuration = '24 Hours';

            if (durationField !== 60 && durationField !== 1440) return interaction.reply('Error: Auto archive duration must be either `60` or `1440` minutes.');

                const thread = await interaction.channel.threads.create({
                    name: nameField,
                    autoArchiveDuration: durationField
                });

        const embed = new MessageEmbed()
            .setTitle('Thread Create')
            .addField('Name', `${thread.name}`)
            .addField('Archive After', `\`${resultDuration}\``)
            .setTimestamp()
            .setColor(embedColor);

        interaction.reply({ embeds: [embed] }).then(thread.leave());
    }
};