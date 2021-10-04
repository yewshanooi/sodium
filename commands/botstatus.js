const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botstatus')
		.setDescription('Change bot\'s current status globally')
        .addStringOption(option => option.setName('status').setDescription('Enter a status (online, idle, dnd or invisible)').setRequired(true)),
    cooldown: '30',
    guildOnly: true,
	execute (interaction) {
        const stringField = interaction.options.getString('status');

        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply('Error: You have no permission to use this command.');
        }

        else if (stringField === 'online') {
            const embedOnline = new MessageEmbed()
                .setTitle('Bot Status')
                .setDescription('Status successfully changed to **Online**')
                .setTimestamp()
                .setColor(embedColor);
            interaction.client.user.setPresence({ status: 'online' });
            interaction.reply({ embeds: [embedOnline] });
        }

        else if (stringField === 'idle') {
            const embedIdle = new MessageEmbed()
                .setTitle('Bot Status')
                .setDescription('Status successfully changed to **Idle**')
                .setTimestamp()
                .setColor(embedColor);
            interaction.client.user.setPresence({ status: 'idle' });
            interaction.reply({ embeds: [embedIdle] });
        }

        else if (stringField === 'dnd') {
            const embedDnd = new MessageEmbed()
                .setTitle('Bot Status')
                .setDescription('Status successfully changed to **Do Not Disturb**')
                .setTimestamp()
                .setColor(embedColor);
            interaction.client.user.setPresence({ status: 'dnd' });
            interaction.reply({ embeds: [embedDnd] });
        }

        else if (stringField === 'invisible') {
            const embedInvisible = new MessageEmbed()
                .setTitle('Bot Status')
                .setDescription('Status successfully changed to **Invisible**')
                .setTimestamp()
                .setColor(embedColor);
            interaction.client.user.setPresence({ status: 'invisible' });
            interaction.reply({ embeds: [embedInvisible] });
        }

        else {
            return interaction.reply('Error: No such status.\n*(Available options - `/botstatus online`, `/botstatus idle`, `/botstatus dnd` or `/botstatus invisible`)*');
        }
	}
};