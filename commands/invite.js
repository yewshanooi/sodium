const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const errors = require('../errors.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Generate an invite link for the guild')
        .addIntegerOption(option => option.setName('duration').setDescription('Select a duration').addChoices({ name: '30 minutes', value: 1800 }, { name: '1 hour', value: 3600 }, { name: '6 hours', value: 21600 }, { name: '12 hours', value: 43200 }, { name: '1 day', value: 86400 }, { name: '7 days', value: 604800 }, { name: 'Never expire', value: 0 }).setRequired(true))
        .addIntegerOption(option => option.setName('limit').setDescription('Select the maximum number of uses').addChoices({ name: 'No limit', value: 0 }, { name: '1 use', value: 1 }, { name: '5 uses', value: 5 }, { name: '10 uses', value: 10 }, { name: '25 uses', value: 25 }, { name: '50 uses', value: 50 }, { name: '100 uses', value: 100 }).setRequired(true)),
    cooldown: '15',
    guildOnly: true,
    async execute (interaction, configuration) {
        if (!interaction.guild.members.me.permissions.has('CreateInstantInvite')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Create Instant Invite** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('CreateInstantInvite')) return interaction.reply({ embeds: [errors[3]] });

        const durationField = interaction.options.getInteger('duration');

            let resultDurationField;
                if (durationField === 1800) resultDurationField = '`30` minutes';
                if (durationField === 3600) resultDurationField = '`1` hour';
                if (durationField === 21600) resultDurationField = '`6` hours';
                if (durationField === 43200) resultDurationField = '`12` hours';
                if (durationField === 86400) resultDurationField = '`1` day';
                if (durationField === 604800) resultDurationField = '`7` days';
                if (durationField === 0) resultDurationField = '`Unlimited`';

        const limitField = interaction.options.getInteger('limit');

            let resultLimitField;
                if (limitField === 0) {
                    resultLimitField = '`No limit`';
                }
                else if (limitField === 1) {
                    resultLimitField = '`1` time';
                }
                else {
                    resultLimitField = `\`${limitField}\` times`;
                }

        const { channel } = interaction;

            const invite = await channel.createInvite({ maxAge: durationField, maxUses: limitField })
                .catch(() => {
                    interaction.reply({ content: 'Error: An error has occured while trying to generate the link' });
                });

            const embed = new EmbedBuilder()
                .setTitle(`${channel.name}`)
                .setDescription(`${invite.url}`)
                .addFields(
                    { name: 'Duration', value: `${resultDurationField}`, inline: true },
                    { name: 'Limit', value: `${resultLimitField}`, inline: true }
                )
                .setColor(configuration.embedColor);

            interaction.reply({ embeds: [embed] });
        }
};