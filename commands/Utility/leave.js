const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Remove the bot from the current guild'),
    cooldown: '15',
    category: 'Utility',
    guildOnly: true,
	execute (interaction, configuration) {
        if (!interaction.member.permissions.has('Administrator')) return interaction.reply({ embeds: [global.errors[2]] });

        const confirmationEmbed = new EmbedBuilder()
            .setTitle('Leave')
            .setDescription(`Are you sure you want to remove ${interaction.client.user}?`)
            .setColor(configuration.embedColor);

        const buttons = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setCustomId('optYes')
                .setLabel('Yes')
                .setStyle('Success'))
            .addComponents(new ButtonBuilder()
                .setCustomId('optNo')
                .setLabel('No')
                .setStyle('Danger'));

            const leftEmbed = new EmbedBuilder()
                .setDescription('Successfully left the guild. We hope to see you again next time!')
                .setColor('#00aa00');

            const cancelEmbed = new EmbedBuilder()
                .setDescription('You have cancelled the leave request.')
                .setColor('#ff5555');

        interaction.reply({ embeds: [confirmationEmbed], components: [buttons] });

            const filter = ft => ft.isButton() && ft.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
                // 30 seconds timeout
                time: 30000
            });

            collector.on('collect', co => {
                if (co.customId === 'optYes') {
                    co.update({ embeds: [leftEmbed], components: [] });
                    interaction.guild.leave();
                }
                if (co.customId === 'optNo') {
                    co.update({ embeds: [cancelEmbed], components: [] }).then(collector.stop());
                }
            });

        }
};