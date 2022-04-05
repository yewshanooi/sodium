const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
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
            if (type === 'GUILD_TEXT') resultType = 'Text';
            if (type === 'GUILD_VOICE') resultType = 'Voice';
            if (type === 'GUILD_CATEGORY') resultType = 'Category';
            if (type === 'GUILD_NEWS') resultType = 'News';
            if (type === 'GUILD_NEWS_THREAD') resultType = 'News Thread';
            if (type === 'GUILD_PUBLIC_THREAD') resultType = 'Public Thread';
            if (type === 'GUILD_PRIVATE_THREAD') resultType = 'Private Thread';
            if (type === 'GUILD_STAGE_VOICE') resultType = 'Stage Voice';
            if (type === 'UNKNOWN') resultType = 'Unknown';

        const { nsfw } = channelField;
        let resultNsfw;
            if (nsfw === true) resultNsfw = 'Yes';
            else resultNsfw = 'No';

            const embed = new MessageEmbed()
                .setTitle(`${channelField.name}`)
                .addFields(
                    { name: 'Type', value: `\`${resultType}\``, inline: true },
                    { name: 'ID', value: `\`${channelField.id}\``, inline: true },
                    { name: 'Created At', value: `\`${channelField.createdAt}\`` },
                    { name: 'NSFW', value: `\`${resultNsfw}\``, inline: true },
                    { name: 'Rate Limit', value: `\`${channelField.rateLimitPerUser || '0'}\` second(s)`, inline: true }
                )
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] });
        }
};