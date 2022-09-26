const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thread')
        .setDescription('Start a new thread channel')
        .addStringOption(option => option.setName('name').setDescription('Enter a thread name').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Select a duration').addChoices({ name: '1 hour', value: 60 }, { name: '24 hours', value: 1440 }).setRequired(true)),
    cooldown: '10',
    category: 'Utility',
    guildOnly: true,
    async execute (interaction, configuration) {
        if (!interaction.guild.members.me.permissions.has('ManageThreads')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Threads** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageThreads')) return interaction.reply({ embeds: [global.errors[3]] });

            const nameField = interaction.options.getString('name');

            const durationField = interaction.options.getInteger('duration');

                let resultDuration;
                    if (durationField === 60) resultDuration = '1 hour';
                    if (durationField === 1440) resultDuration = '24 hours';

                const thread = await interaction.channel.threads.create({
                    name: nameField,
                    autoArchiveDuration: durationField
                });

        const embed = new EmbedBuilder()
            .setTitle('Thread')
            .addFields(
                { name: 'Name', value: `${thread.name}` },
                { name: 'Archive After', value: `\`${resultDuration}\`` }
            )
            .setColor(configuration.embedColor);

        interaction.reply({ embeds: [embed] });
    }
};