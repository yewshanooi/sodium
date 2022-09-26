const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Display information about the bot'),
    cooldown: '3',
    category: 'Utility',
    guildOnly: false,
	execute (interaction, configuration) {
        let totalSeconds = interaction.client.uptime / 1000;
            const days = Math.floor(totalSeconds / 86400);
                totalSeconds %= 86400;
            const hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds % 60);

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.user.tag}`)
            .addFields(
                { name: 'ID', value: `\`${interaction.client.user.id}\``, inline: true },
                { name: 'Embed Color (HEX)', value: `\`#${configuration.embedColor}\``, inline: true },
                { name: 'Creation Date & Time', value: `\`${interaction.client.user.createdAt}\`` },
                { name: 'Users', value: `\`${interaction.client.users.cache.size}\``, inline: true },
                { name: 'Channels', value: `\`${interaction.client.channels.cache.size}\``, inline: true },
                { name: 'Guilds', value: `\`${interaction.client.guilds.cache.size}\``, inline: true },
                { name: 'Uptime', value: `\`${days}\` day(s), \`${hours}\` hour(s), \`${minutes}\` minute(s), \`${seconds}\` second(s)` }
            )
            .setColor(configuration.embedColor);
        interaction.reply({ embeds: [embed] });
	}
};