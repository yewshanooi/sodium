const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('Display information(s) about the bot'),
    cooldown: '5',
    guildOnly: false,
	execute (interaction) {
        let totalSeconds = interaction.client.uptime / 1000;
            const days = Math.floor(totalSeconds / 86400);
                totalSeconds %= 86400;
            const hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds % 60);

        const embed = new MessageEmbed()
            .setTitle('Bot Info')
            .addField('Name', `\`${interaction.client.user.username}\``, true)
            .addField('Discriminator', `\`${interaction.client.user.discriminator}\``, true)
            .addField('Creation Date & Time', `\`${interaction.client.user.createdAt}\``)
            .addField('Users', `\`${interaction.client.users.cache.size}\``, true)
            .addField('Channels', `\`${interaction.client.channels.cache.size}\``, true)
            .addField('Guilds', `\`${interaction.client.guilds.cache.size}\``, true)
            .addField('Embed Color (Hex)', `\`#${embedColor}\``, true)
            .addField('ID', `\`${interaction.client.user.id}\``, true)
            .addField('Uptime', `\`${days}\` *days(s)*, \`${hours}\` *hours(s)*, \`${minutes}\` *minute(s)*, \`${seconds}\` *second(s)*`)
            .setColor(embedColor);
        interaction.reply({ embeds: [embed] });
	}
};