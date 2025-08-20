const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Add or remove points, reset, or view guild leaderboard')
        .addSubcommand(subcommand => subcommand.setName('add').setDescription('Add leaderboard points')
            .addIntegerOption(option => option.setName('amount').setDescription('Enter an amount').setRequired(true))
            .addUserOption(option => option.setName('user').setDescription('Select a user')))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove leaderboard points')
            .addIntegerOption(option => option.setName('amount').setDescription('Enter an amount').setRequired(true))
            .addUserOption(option => option.setName('user').setDescription('Select a user')))
        .addSubcommand(subcommand => subcommand.setName('reset').setDescription('Reset leaderboard for current guild'))
        .addSubcommand(subcommand => subcommand.setName('view').setDescription('Show the top 10 users by points or the selected user')
            .addUserOption(option => option.setName('user').setDescription('Select a user'))),
    cooldown: '5',
    category: 'Utility',
    guildOnly: true,
    async execute (interaction, configuration) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [global.errors[2]] });

        // leaderboard add {amount} {user} Subcommand
        if (interaction.options.getSubcommand() === 'add') {
            await interaction.deferReply();

            const guildDB = await Guild.findOne({ 'guild.id': interaction.guild.id });
                if (!guildDB) return interaction.editReply({ embeds: [global.errors[5]] });

            const amountField = interaction.options.getInteger('amount');
                if (amountField <= 0) return interaction.editReply({ content: 'Error: Amount must be a positive number greater than zero.' });

            let userField = interaction.options.getMember('user');
                if (!userField) {
                    userField = interaction.member;
                }

            const addLeaderboard = new EmbedBuilder()
                .setTitle('Leaderboard')
                .setDescription(`Added **+${amountField}** points to ${userField.user.username}`)
                .setColor(configuration.embedColor)
                .setTimestamp();

            try {
                const updateResult = await Guild.findOneAndUpdate({
                    'guild.id': interaction.guild.id,
                    'leaderboards.user.id': userField.user.id
                }, {
                        $inc: { 'leaderboards.$.points': amountField }
                    }
                );

                if (!updateResult) {
                    const getId = new mongoose.Types.ObjectId();

                    await Guild.findOneAndUpdate({
                        'guild.id': interaction.guild.id
                    }, {
                        $push: {
                            leaderboards: {
                                _id: getId,
                                user: {
                                    name: userField.user.username,
                                    id: userField.user.id
                                },
                                points: amountField
                            }
                        }
                    });
                }
            } catch (err) {
                console.error(err);
            }

            return interaction.editReply({ embeds: [addLeaderboard] });
        }

        // leaderboard remove {amount} {user} Subcommand
        if (interaction.options.getSubcommand() === 'remove') {
            await interaction.deferReply();

            const guildDB = await Guild.findOne({ 'guild.id': interaction.guild.id });
                if (!guildDB) return interaction.editReply({ embeds: [global.errors[5]] });

            const amountField = interaction.options.getInteger('amount');
                if (amountField <= 0) return interaction.editReply({ content: 'Error: Amount must be a positive number greater than zero.' });

            let userField = interaction.options.getMember('user');
                if (!userField) {
                    userField = interaction.member;
                }

            const userEntry = guildDB.leaderboards.find(entry => entry.user.id === userField.user.id);

                if (!userEntry) return interaction.editReply({ content: `Error: ${userField.user.username} doesn't exist in the leaderboard.` });
                if (userEntry.points === 0) return interaction.editReply({ content: `Error: ${userField.user.username} already has 0 points.` });
                if (userEntry.points < amountField) return interaction.editReply({ content: `Error: Cannot remove ${amountField} points. ${userField.user.username} only has ${userEntry.points} points.` });

            const removeLeaderboard = new EmbedBuilder()
                .setTitle('Leaderboard')
                .setDescription(`Removed **-${amountField}** points from ${userField.user.username}`)
                .setColor(configuration.embedColor)
                .setTimestamp();

            try {
                await Guild.findOneAndUpdate({
                    'guild.id': interaction.guild.id,
                    'leaderboards.user.id': userField.user.id
                }, {
                        $inc: { 'leaderboards.$.points': -amountField }
                    }
                );

            } catch (err) {
                console.error(err);
                return interaction.editReply({ content: 'Error: There was a problem removing the points.' });
            }

            return interaction.editReply({ embeds: [removeLeaderboard] });
        }

        // leaderboard reset Subcommand
        if (interaction.options.getSubcommand() === 'reset') {
            await interaction.deferReply();

            const guildDB = await Guild.findOne({ 'guild.id': interaction.guild.id });
                if (!guildDB) return interaction.editReply({ embeds: [global.errors[5]] });

            const resetLeaderboard = new EmbedBuilder()
                .setTitle('Leaderboard')
                .setDescription('Are you sure you want to reset the leaderboard for this guild?')
                .setColor(configuration.embedColor);

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('resetYes')
                        .setLabel('Yes')
                        .setStyle('Success'),
                    new ButtonBuilder()
                        .setCustomId('resetNo')
                        .setLabel('No')
                        .setStyle('Danger'));

            await interaction.editReply({ embeds: [resetLeaderboard], components: [buttons] });

            const filter = (ft) => ft.isButton() && ft.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 30000 // 30 seconds timeout
            });

            collector.on('collect', async (co) => {
                if (co.customId === 'resetYes') {
                    try {
                        await Guild.updateOne({
                            'guild.id': interaction.guild.id
                        }, {
                            $set: { 
                                leaderboards: [] 
                            }
                        });

                        const yesEmbed = new EmbedBuilder()
                            .setTitle('Leaderboard')
                            .setDescription('The leaderboard has been successfully reset.')
                            .setColor(configuration.embedColor)
                            .setTimestamp();

                        await co.update({ embeds: [yesEmbed], components: [] });
                    } catch (err) {
                        console.error(err);
                        await co.update({ content: 'Error: Unable to reset leaderboard. Please try again.', components: [] });
                    }
                }
                if (co.customId === 'resetNo') {
                    const noEmbed = new EmbedBuilder()
                        .setDescription('You have cancelled the reset request.')
                        .setColor('#ff5555');

                    await co.update({ embeds: [noEmbed], components: [] });
                }
            });

            collector.on('end', (__, reason) => {
                if (reason === 'time') {
                    interaction.editReply({ embeds: [
                        new EmbedBuilder()
                            .setTitle('Leaderboard')
                            .setDescription('Command has ended. Retype `/leaderboard reset` to request again.')
                            .setColor(configuration.embedColor)
                    ], components: [] });
                }
            });
        }

        // leaderboard view {user} Subcommand
        if (interaction.options.getSubcommand() === 'view') {
            await interaction.deferReply();

            const guildDB = await Guild.findOne({ 'guild.id': interaction.guild.id });
                if (!guildDB) return interaction.editReply({ embeds: [global.errors[5]] });

            const userField = interaction.options.getMember('user');

            if (userField) {
                const userEntry = guildDB.leaderboards.find(entry => entry.user.id === userField.user.id);

                    if (!userEntry) return interaction.editReply({ content: `Error: ${userField.user.username} doesn't exist in the leaderboard.` });

                const userEmbed = new EmbedBuilder()
                    .setTitle('Leaderboard')
                    .addFields({ name: `${userField.user.username}`, value: `${userEntry.points} points` })
                    .setColor(configuration.embedColor)
                    .setTimestamp();

                return interaction.editReply({ embeds: [userEmbed] });
            }

            const topUsers = guildDB.leaderboards
                .sort((a, b) => b.points - a.points)
                .slice(0, 10);

            if (topUsers.length === 0) {
                const emptyLeaderboard = new EmbedBuilder()
                    .setTitle('Leaderboard')
                    .setDescription('*No history found.*')
                    .setColor(configuration.embedColor);

                return interaction.editReply({ embeds: [emptyLeaderboard] });
            }

            const viewLeaderboard = new EmbedBuilder()
                .setTitle('Leaderboard')
                .addFields(
                    topUsers.map((entry, index) => ({
                        name: `#${index + 1} - ${entry.user.name}`,
                        value: `${entry.points} points`
                    }))
                )
                .setColor(configuration.embedColor)
                .setTimestamp();

            return interaction.editReply({ embeds: [viewLeaderboard] });
        }

    }
};