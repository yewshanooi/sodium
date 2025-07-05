const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Display information about the channel, client, guild, role, or user')
        .addSubcommand(subcommand => subcommand.setName('channel').setDescription('Display information about the selected channel')
            .addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('client').setDescription('Display information about the client'))
        .addSubcommand(subcommand => subcommand.setName('guild').setDescription('Display information about the guild'))
        .addSubcommand(subcommand => subcommand.setName('role').setDescription('Display information about the selected role')
            .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('user').setDescription('Display information about the selected user')
            .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))),
    cooldown: '3',
    category: 'Utility',
    guildOnly: true,
    execute (interaction, configuration) {
        const channelField = interaction.options.getChannel('channel');
        const roleField = interaction.options.getRole('role');
        const userField = interaction.options.getUser('user');
		const memberUserField = interaction.options.getMember('user');

        // info channel Subcommand
        if (interaction.options.getSubcommand() === 'channel') {
            const { type } = channelField;
            let resultType;
                if (type === 0) resultType = 'Text';
                if (type === 2) resultType = 'Voice';
                if (type === 4) resultType = 'Category';
                if (type === 5) resultType = 'Announcement';
                if (type === 10) resultType = 'Announcement Thread';
                if (type === 11) resultType = 'Public Thread';
                if (type === 12) resultType = 'Private Thread';
                if (type === 13) resultType = 'Stage Voice';
                if (type === 15) resultType = 'Forum';
                if (type === null) resultType = 'Unknown';

            const { nsfw } = channelField;
            let resultNsfw;
                if (nsfw === true) resultNsfw = 'Yes';
                else resultNsfw = 'No';

            const channelEmbed = new EmbedBuilder()
                .setTitle(`${channelField.name}`)
                .addFields(
                    { name: 'Type', value: `\`${resultType}\``, inline: true },
                    { name: 'ID', value: `\`${channelField.id}\``, inline: true },
                    { name: 'Created At', value: `\`${channelField.createdAt}\`` },
                    { name: 'Age-Restricted', value: `\`${resultNsfw}\``, inline: true },
                    { name: 'Rate Limit', value: `\`${channelField.rateLimitPerUser || '0'}\` second(s)`, inline: true }
                )
                .setColor(configuration.embedColor);
            return interaction.reply({ embeds: [channelEmbed] });
        }

        // info client Subcommand
        if (interaction.options.getSubcommand() === 'client') {
            let totalSeconds = interaction.client.uptime / 1000;
            const days = Math.floor(totalSeconds / 86400);
                totalSeconds %= 86400;
            const hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds % 60);

            const clientEmbed = new EmbedBuilder()
                .setTitle(`${interaction.client.user.username}`)
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
            return interaction.reply({ embeds: [clientEmbed] });
        }

        // info guild Subcommand
        if (interaction.options.getSubcommand() === 'guild') {
            const { mfaLevel } = interaction.guild;
            let resultMfaLevel;
                if (mfaLevel === 0) resultMfaLevel = 'Disabled';
                if (mfaLevel === 1) resultMfaLevel = 'Enabled';

            const totalRoles = interaction.guild.roles.cache.size - 1;

            const { partnered } = interaction.guild;
            let resultPartnered;
                if (partnered === true) resultPartnered = 'Yes';
                else resultPartnered = 'No';

            const { verified } = interaction.guild;
            let resultVerified;
                if (verified === true) resultVerified = 'Yes';
                else resultVerified = 'No';

            const { premiumTier } = interaction.guild;
            let resultPremiumTier;
                if (premiumTier === 0) resultPremiumTier = 'Unboosted';
                if (premiumTier === 1) resultPremiumTier = 'Level 1';
                if (premiumTier === 2) resultPremiumTier = 'Level 2';
                if (premiumTier === 3) resultPremiumTier = 'Level 3';

            const { verificationLevel } = interaction.guild;
            let resultVerificationLevel;
                if (verificationLevel === 0) resultVerificationLevel = 'None';
                if (verificationLevel === 1) resultVerificationLevel = 'Low';
                if (verificationLevel === 2) resultVerificationLevel = 'Medium';
                if (verificationLevel === 3) resultVerificationLevel = 'High';
                if (verificationLevel === 4) resultVerificationLevel = 'Highest';

            const { explicitContentFilter } = interaction.guild;
            let resultExplicitContentFilter;
                if (explicitContentFilter === 0) resultExplicitContentFilter = 'Disabled';
                if (explicitContentFilter === 1) resultExplicitContentFilter = 'Members Without Roles';
                if (explicitContentFilter === 2) resultExplicitContentFilter = 'All Members';

            const guildEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name}`)
                .addFields(
                    { name: 'Language', value: `\`${interaction.guild.preferredLocale}\``, inline: true },
                    { name: '2FA', value: `\`${resultMfaLevel}\``, inline: true },
                    { name: 'ID', value: `\`${interaction.guild.id}\``, inline: true },
                    { name: 'Creation Date & Time', value: `\`${interaction.guild.createdAt}\`` },
                    { name: 'Members', value: `\`${interaction.guild.memberCount}\``, inline: true },
                    { name: 'Channels', value: `\`${interaction.guild.channels.cache.filter(ch => ch.type !== 'category').size}\``, inline: true },
                    { name: 'Roles', value: `\`${totalRoles}\``, inline: true },
                    { name: 'Partnered', value: `\`${resultPartnered}\``, inline: true },
                    { name: 'Verified', value: `\`${resultVerified}\``, inline: true },
                    { name: 'Boost Level', value: `\`${resultPremiumTier}\``, inline: true },
                    { name: 'Verification Level', value: `\`${resultVerificationLevel}\``, inline: true },
                    { name: 'Explicit Image Filter', value: `\`${resultExplicitContentFilter}\``, inline: true }
                )
                .setColor(configuration.embedColor);
            return interaction.reply({ embeds: [guildEmbed] });
        }

        // info role Subcommand
        if (interaction.options.getSubcommand() === 'role') {
            const { mentionable } = roleField;
            let resultMentionable;
                if (mentionable === true) resultMentionable = 'Yes';
                else resultMentionable = 'No';

            const { hoist } = roleField;
            let resultHoist;
                if (hoist === true) resultHoist = 'Yes';
                else resultHoist = 'No';

                const everyone = interaction.guild.roles.cache.find(role => role.name === '@everyone');
                    if (roleField === everyone) return interaction.reply({ content: 'Error: Unable to get information about this role.' });

            const roleEmbed = new EmbedBuilder()
                .setTitle(`${roleField.name}`)
                .addFields(
                    { name: 'Position', value: `\`${roleField.position}\``, inline: true },
                    { name: 'Color (HEX)', value: `\`${roleField.hexColor}\``, inline: true },
                    { name: 'ID', value: `\`${roleField.id}\``, inline: true },
                    { name: 'Creation Date & Time', value: `\`${roleField.createdAt}\`` },
                    { name: 'Members', value: `\`${roleField.members.size}\``, inline: true },
                    { name: 'Mentionable', value: `\`${resultMentionable}\``, inline: true },
                    { name: 'Display Separately', value: `\`${resultHoist}\``, inline: true }
                )
                .setColor(configuration.embedColor);
            return interaction.reply({ embeds: [roleEmbed] });
        }

        // info user Subcommand
        if (interaction.options.getSubcommand() === 'user') {
            const { bot } = userField;
            let resultBot;
                if (bot === true) resultBot = 'Yes';
                else resultBot = 'No';

            const hoistRole = memberUserField.roles.hoist;
            let resultHoistRole;
                if (hoistRole === null) resultHoistRole = '`None`';
                else resultHoistRole = hoistRole;

            const userEmbed = new EmbedBuilder()
                .setTitle(`${userField.username}`)
                .setThumbnail(`https://cdn.discordapp.com/avatars/${userField.id}/${userField.avatar}.jpeg`)
                .addFields(
                    { name: 'Nickname', value: `\`${memberUserField.nickname || 'None'}\``, inline: true },
                    { name: 'ID', value: `\`${userField.id}\``, inline: true },
                    { name: 'Creation Date & Time', value: `\`${userField.createdAt}\`` },
                    { name: 'Bot', value: `\`${resultBot}\``, inline: true },
                    { name: 'Highest Role', value: `${resultHoistRole}`, inline: true },
                    { name: 'Role Color (HEX)', value: `\`${memberUserField.displayHexColor}\``, inline: true },
                    { name: 'Joined Guild At', value: `\`${memberUserField.joinedAt}\`` }
                )
                .setColor(configuration.embedColor);
            return interaction.reply({ embeds: [userEmbed] });
        }

    }
};