const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('channelinfo')
        .setDescription('Display information(s) about the selected channel')
        .addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)),
    cooldown: '3',
    guildOnly: true,
    execute (interaction) {
        const channelField = interaction.options.getChannel('channel');

        const { type } = channelField;
        let resultType;
            if (type === 0) resultType = 'Text';
            if (type === 2) resultType = 'Voice';
            if (type === 4) resultType = 'Category';
            if (type === 5) resultType = 'News';
            if (type === 10) resultType = 'News Thread';
            if (type === 11) resultType = 'Public Thread';
            if (type === 12) resultType = 'Private Thread';
            if (type === 13) resultType = 'Stage Voice';
            if (type === null) resultType = 'Unknown';

        const { nsfw } = channelField;
        let resultNsfw;
            if (nsfw === true) resultNsfw = 'Yes';
            else resultNsfw = 'No';

            const embed = new EmbedBuilder()
                .setTitle(`${channelField.name}`)
                .addFields(
                    { name: 'Type', value: `\`${resultType}\``, inline: true },
                    { name: 'ID', value: `\`${channelField.id}\``, inline: true },
                    { name: 'Created At', value: `\`${channelField.createdAt}\`` },
                    { name: 'Age-Restricted', value: `\`${resultNsfw}\``, inline: true },
                    { name: 'Rate Limit', value: `\`${channelField.rateLimitPerUser || '0'}\` second(s)`, inline: true }
                )
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] });
        }
};