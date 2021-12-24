const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Display information(s) about the bot'),
    cooldown: '3',
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
            .setTitle(`${interaction.client.user.tag}`)
            .addFields(
                { name: 'ID', value: `\`${interaction.client.user.id}\``, inline: true },
                { name: 'Embed Color (Hex)', value: `\`#${embedColor}\``, inline: true },
                { name: 'Creation Date & Time', value: `\`${interaction.client.user.createdAt}\`` },
                { name: 'Users', value: `\`${interaction.client.users.cache.size}\``, inline: true },
                { name: 'Channels', value: `\`${interaction.client.channels.cache.size}\``, inline: true },
                { name: 'Guilds', value: `\`${interaction.client.guilds.cache.size}\``, inline: true },
                { name: 'Uptime', value: `\`${days}\` day(s), \`${hours}\` hour(s), \`${minutes}\` minute(s), \`${seconds}\` second(s)` }
            )
            .setColor(embedColor);
        interaction.reply({ embeds: [embed] });
	}
};