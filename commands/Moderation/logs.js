const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Add, remove, reset, or view guild moderation logs')
        .addSubcommand(subcommand => subcommand.setName('add').setDescription('Add a new log entry')
            .addStringOption(option => option.setName('type').setDescription('Select a type').addChoices({ name: 'Ban', value: 'ban' }, { name: 'Deafen', value: 'deafen' }, { name: 'Kick', value: 'kick' }, { name: 'Timeout', value: 'timeout' }, { name: 'Unban', value: 'unban' }, { name: 'Undeafen', value: 'undeafen' }, { name: 'Untimeout', value: 'untimeout' }, { name: 'Warn', value: 'warn' }).setRequired(true))
            .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
            .addStringOption(option => option.setName('reason').setDescription('Enter a reason')))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove an existing log entry by ID')
            .addStringOption(option => option.setName('log_id').setDescription('Enter a log id').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('reset').setDescription('Reset logs for current guild'))
        .addSubcommand(subcommand => subcommand.setName('view').setDescription('Show the 10 latest log entries or by ID')
            .addStringOption(option => option.setName('log_id').setDescription('Enter a log id'))),
	cooldown: '5',
	category: 'Moderation',
	guildOnly: true,
	async execute (interaction, configuration) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [global.errors[2]] });

        // logs add {type} {user} {reason} Subcommand
        if (interaction.options.getSubcommand() === 'add') {
            await interaction.deferReply();

            const guildDB = await Guild.findOne({ 'guild.id': interaction.guild.id });
                if (!guildDB) return interaction.editReply({ embeds: [global.errors[5]] });

            const typeField = interaction.options.getString('type');
                const resultType = typeField.charAt(0).toUpperCase() + typeField.slice(1);
            const userField = interaction.options.getMember('user');

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

            const getId = new mongoose.Types.ObjectId();

            const addLog = new EmbedBuilder()
                .setTitle(`${resultType}`)
                .setDescription(`\`${getId}\``)
                .addFields(
                    { name: 'User', value: `${userField.user.username} \`${userField.user.id}\`` },
                    { name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
                    { name: 'Reason', value: `${reasonField}` }
                )
                .setTimestamp()
                .setColor(configuration.embedColor);

            try {
                await Guild.findOneAndUpdate({
                    'guild.id': interaction.guild.id
                }, {
                    $push: {
                        logs: {
                            _id: getId,
                            type: resultType,
                            user: {
                                name: userField.user.username,
                                id: userField.user.id
                            },
                            staff: {
                                name: interaction.user.username,
                                id: interaction.user.id
                            },
                            reason: reasonField
                        }
                    }
                });
            } catch (err) {
                console.error(err);
            }

            return interaction.editReply({ embeds: [addLog] });
        }

        // logs remove {log_id} Subcommand
        if (interaction.options.getSubcommand() === 'remove') {
            await interaction.deferReply();

            const guildDB = await Guild.findOne({ 'guild.id': interaction.guild.id });
                if (!guildDB) return interaction.editReply({ embeds: [global.errors[5]] });

            if (guildDB.logs.length > 0) {
                const logIdField = interaction.options.getString('log_id');
                    if (!mongoose.Types.ObjectId.isValid(logIdField)) return interaction.editReply({ content: 'Error: Log ID is invalid.' });

                    const idFound = guildDB.logs.some(item => item._id.toString() === logIdField);
                        if (!idFound) return interaction.editReply({ content: 'Error: No log entry found with that ID.' });

                try {
                    await Guild.updateOne({
                        'guild.id': interaction.guild.id
                    }, {
                        $pull: {
                            logs: {
                                _id: logIdField
                            }
                        }
                    });

                    const removeLog = new EmbedBuilder()
                        .setTitle('Logs')
                        .setDescription(`Successfully removed log entry with ID of **${logIdField}**`)
                        .setColor(configuration.embedColor)
                        .setTimestamp();

                    return interaction.editReply({ embeds: [removeLog] });
                } catch (err) {
                    console.error(err);
                }
            } else {
                return interaction.editReply({ content: 'Error: No log history found.' });
            }
        }

        // logs reset Subcommand
        if (interaction.options.getSubcommand() === 'reset') {
            await interaction.deferReply();

            const guildDB = await Guild.findOne({ 'guild.id': interaction.guild.id });
                if (!guildDB) return interaction.editReply({ embeds: [global.errors[5]] });

            const resetLog = new EmbedBuilder()
                .setTitle('Logs')
                .setDescription('Are you sure you want to reset all log entries for this guild?')
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

            await interaction.editReply({ embeds: [resetLog], components: [buttons] });

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
                                logs: []
                            }
                        });

                        const yesEmbed = new EmbedBuilder()
                            .setTitle('Logs')
                            .setDescription('Successfully reset all log entries for this guild.')
                            .setColor(configuration.embedColor)
                            .setTimestamp();

                        await co.update({ embeds: [yesEmbed], components: [] });
                    } catch (err) {
                        console.error(err);
                        await co.update({ content: 'Error: Unable to reset logs. Please try again.', components: [] });
                    }
                }
                if (co.customId === 'resetNo') {
                    const noEmbed = new EmbedBuilder()
                        .setDescription('You have cancelled the reset request.')
                        .setColor('#ff5555');

                    await co.update({ embeds: [noEmbed], components: [] });
                }
            });

            collector.on('end', async (__, reason) => {
                if (reason === 'time') {
                    try {
                        await interaction.editReply({ embeds: [
                            new EmbedBuilder()
                                .setTitle('Logs')
                                .setDescription('Command has ended. Retype `/logs reset` to request again.')
                                .setColor(configuration.embedColor)
                        ], components: [] });
                    } catch (error) {
                        if (error.code === 10008) {
                            await interaction.followUp({ embeds: [
                                new EmbedBuilder()
                                    .setTitle('Logs')
                                    .setDescription('Command has ended. Retype `/logs reset` to request again.')
                                    .setColor(configuration.embedColor)
                            ]});
                        }
                    }
                }
            });

        }

        // logs view {log_id} Subcommand
        if (interaction.options.getSubcommand() === 'view') {
            await interaction.deferReply();

            const guildDB = await Guild.findOne({ 'guild.id': interaction.guild.id });
                if (!guildDB) return interaction.editReply({ embeds: [global.errors[5]] });

            const logIdField = interaction.options.getString('log_id');

            if (logIdField) {
                // Query specific log by ID
                const logEntry = guildDB.logs.find(item => item._id.toString() === logIdField);

                if (!logEntry) {
                    return interaction.editReply({ content: 'Error: No log entry found with that ID.' });
                }

                const viewSingleLog = new EmbedBuilder()
                    .setTitle('Logs')
                    .setDescription(
                        `**Type:** ${logEntry.type} \`${logEntry._id.toString()}\`
                        **User:** ${logEntry.user.name ? logEntry.user.name : ''} \`${logEntry.user.id}\`
                        **By:** ${logEntry.staff.name} \`${logEntry.staff.id}\`
                        **Reason:** ${logEntry.reason}
                        **Timestamp:** ${logEntry.timestamp}`
                    )
                    .setColor(configuration.embedColor);

                return interaction.editReply({ embeds: [viewSingleLog] });
            } else {
                // Display 10 latest items from the log
                const viewLog = new EmbedBuilder()
                    .setTitle('Logs')
                    .setColor(configuration.embedColor);

                const latestItems = guildDB.logs.slice(-10);

                let description = '';
                if (latestItems.length > 0) {
                    latestItems.forEach(item => {
                        description += `**Type:** ${item.type} \`${item._id.toString()}\`
                        **User:** ${item.user.name ? item.user.name : ''} \`${item.user.id}\`
                        **By:** ${item.staff.name} \`${item.staff.id}\`
                        **Reason:** ${item.reason}
                        **Timestamp:** ${item.timestamp}
                        \n`;
                    });
                } else {
                    description = '*No history found.*';
                }

                viewLog.setDescription(description);

                return interaction.editReply({ embeds: [viewLog] });
            }
        }

	}
};