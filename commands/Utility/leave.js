const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Remove the bot from the current guild'),
    cooldown: '15',
    category: 'Utility',
    guildOnly: true,
	execute (interaction, configuration) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [global.errors[2]] });

        const confirmationEmbed = new EmbedBuilder()
            .setTitle('Leave')
            .setDescription(`Are you sure you want to remove ${interaction.client.user}?`)
            .setColor(configuration.embedColor);

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('optYes')
                    .setLabel('Yes')
                    .setStyle('Success'),
                new ButtonBuilder()
                    .setCustomId('optNo')
                    .setLabel('No')
                    .setStyle('Danger'));

        interaction.reply({ embeds: [confirmationEmbed], components: [buttons] });

            const filter = ft => ft.isButton() && ft.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 30000 // 30 seconds timeout
            });

            collector.on('collect', co => {
                if (co.customId === 'optYes') {
                    const yesEmbed = new EmbedBuilder()
                        .setTitle('Leave')
                        .setDescription('Successfully left the guild. We hope to see you again next time!')
                        .setColor(configuration.embedColor)
                        .setTimestamp();

                    co.update({ embeds: [yesEmbed], components: [] });
                    interaction.guild.leave();
                }
                if (co.customId === 'optNo') {
                    const noEmbed = new EmbedBuilder()
                        .setDescription('You have cancelled the leave request.')
                        .setColor('#ff5555');

                    co.update({ embeds: [noEmbed], components: [] }).then(collector.stop());
                }
            });

            collector.on('end', (__, reason) => {
                if (reason === 'time') {
                    interaction.editReply({ embeds: [
                        new EmbedBuilder()
                            .setTitle('Leave')
                            .setDescription('Command has ended. Retype `/leave` to request again.')
                            .setColor(configuration.embedColor)
                        ], components: [] });
                    }
                } else {
                    interaction.editReply({ components: [] });
                }
            });

        }
};