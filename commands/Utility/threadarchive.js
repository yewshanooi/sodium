const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('threadarchive')
        .setDescription('Archive an existing thread channel')
        .addChannelOption(option => option.setName('thread').setDescription('Select a thread channel').setRequired(true)),
    cooldown: '15',
    category: 'Utility',
    guildOnly: true,
    execute (interaction, configuration) {
        if (!interaction.guild.members.me.permissions.has('ManageThreads')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Threads** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageThreads')) return interaction.reply({ embeds: [global.errors[3]] });

            const threadField = interaction.options.getChannel('thread');

            if (threadField.type === 11 || threadField.type === 12) {
                const embed = new EmbedBuilder()
                    .setDescription(`Successfully archived **${threadField}** channel`)
                    .setColor(configuration.embedColor);

                threadField.setArchived(true)
                    .then(() => {
                        interaction.reply({ embeds: [embed] });
                    })
                    .catch(() => {
                        interaction.reply({ content: 'Error: There was an error trying to archive this thread channel.' });
                    });
                }
            else {
                interaction.reply({ content: 'Error: Channel is not a thread.' });
            }

        }
};