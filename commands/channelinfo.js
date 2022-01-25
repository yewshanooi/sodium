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

        const channelType = channelField.type;
        let resultChannelType;
            if (channelType === 'GUILD_TEXT') resultChannelType = 'Text';
            if (channelType === 'GUILD_VOICE') resultChannelType = 'Voice';
            if (channelType === 'GUILD_CATEGORY') resultChannelType = 'Category';
            if (channelType === 'GUILD_NEWS') resultChannelType = 'News';
            if (channelType === 'GUILD_NEWS_THREAD') resultChannelType = 'News Thread';
            if (channelType === 'GUILD_PUBLIC_THREAD') resultChannelType = 'Public Thread';
            if (channelType === 'GUILD_PRIVATE_THREAD') resultChannelType = 'Private Thread';
            if (channelType === 'GUILD_STAGE_VOICE') resultChannelType = 'Stage Voice';
            if (channelType === 'UNKNOWN') resultChannelType = 'Unknown';

        const isNSFW2 = channelField.nsfw;
        let resultNSFW2;
            if (isNSFW2 === true) resultNSFW2 = 'Yes';
            else resultNSFW2 = 'No';

            const embed = new MessageEmbed()
                .setTitle(`${channelField.name}`)
                .addFields(
                    { name: 'Type', value: `\`${resultChannelType}\``, inline: true },
                    { name: 'ID', value: `\`${channelField.id}\``, inline: true },
                    { name: 'Created At', value: `\`${channelField.createdAt}\`` },
                    { name: 'NSFW', value: `\`${resultNSFW2}\``, inline: true },
                    { name: 'Rate Limit', value: `\`${channelField.rateLimitPerUser || '0'}\` second(s)`, inline: true }
                )
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] });
        }
};