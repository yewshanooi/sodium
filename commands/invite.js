const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Generate an invite link for the guild')
        .addIntegerOption(option => option.setName('duration').setDescription('Duration of invite link').addChoice('30 minutes', 1800).addChoice('1 hour', 3600).addChoice('6 hours', 21600).addChoice('12 hours', 43200).addChoice('1 day', 86400).addChoice('7 days', 604800).addChoice('Never expire', 0).setRequired(true))
        .addIntegerOption(option => option.setName('limit').setDescription('Maximum number of uses').addChoice('No limit', 0).addChoice('1 use', 1).addChoice('5 uses', 5).addChoice('10 uses', 10).addChoice('25 uses', 25).addChoice('50 uses', 50).addChoice('100 uses', 100).setRequired(true)),
    cooldown: '15',
    guildOnly: true,
    async execute (interaction) {
        if (!interaction.guild.me.permissions.has('CREATE_INSTANT_INVITE')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **CREATE_INSTANT_INVITE** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('CREATE_INSTANT_INVITE')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

        const durationField = interaction.options.getInteger('duration');

            let resultDuration;
                if (durationField === 1800) resultDuration = '`30` minutes';
                if (durationField === 3600) resultDuration = '`1` hour';
                if (durationField === 21600) resultDuration = '`6` hours';
                if (durationField === 43200) resultDuration = '`12` hours';
                if (durationField === 86400) resultDuration = '`1` day';
                if (durationField === 604800) resultDuration = '`7` days';
                if (durationField === 0) resultDuration = '`Unlimited`';

        const limitField = interaction.options.getInteger('limit');

            let resultLimit;
                if (limitField === 0) {
                    resultLimit = '`No limit`';
                }
                else if (limitField === 1) {
                    resultLimit = `\`${limitField}\` time`;
                }
                else {
                    resultLimit = `\`${limitField}\` times`;
                }

        const { channel } = interaction;

            const invite = await channel.createInvite({ maxAge: durationField, maxUses: limitField })
                .catch(() => {
                    interaction.reply({ content: 'Error: An error has occured while trying to generate the link' });
                });

            const embed = new MessageEmbed()
                .setTitle(`${channel.name}`)
                .setDescription(`${invite.url}`)
                .addFields(
                    { name: 'Duration', value: `${resultDuration}`, inline: true },
                    { name: 'Limit', value: `${resultLimit}`, inline: true }
                )
                .setColor(embedColor);

            interaction.reply({ embeds: [embed] });
        }
};