const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Log = require('../../schemas/log');
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Add, initialize, or view logs for moderation commands')
        .addSubcommand(subcommand => subcommand.setName('add').setDescription('Add a moderation log entry')
            .addStringOption(option => option.setName('type').setDescription('Select a type').addChoices({ name: 'Ban', value: 'ban' }, { name: 'Deafen', value: 'deafen' }, { name: 'Kick', value: 'kick' }, { name: 'Timeout', value: 'timeout' }, { name: 'Unban', value: 'unban' }, { name: 'Undeafen', value: 'undeafen' }, { name: 'Untimeout', value: 'untimeout' }, { name: 'Warn', value: 'warn' }).setRequired(true))
            .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
            .addStringOption(option => option.setName('reason').setDescription('Enter a reason')))
        .addSubcommand(subcommand => subcommand.setName('initialize').setDescription('Initialize moderation logs for current guild'))
        .addSubcommand(subcommand => subcommand.setName('view').setDescription('Show the 10 latest logs')),
	cooldown: '5',
	category: 'Moderation',
	guildOnly: true,
	async execute (interaction, configuration) {
        if (!interaction.member.permissions.has('Administrator')) return interaction.editReply({ embeds: [global.errors[2]] });

        // log add Subcommand
        if (interaction.options.getSubcommand() === 'add') {
            await interaction.deferReply();

            const guildLog = await Log.findOne({ 'guild.id': interaction.guild.id });
                if (guildLog === null) return interaction.editReply({ embeds: [global.errors[5]] });

            const typeField = interaction.options.getString('type');
                const resultType = typeField.charAt(0).toUpperCase() + typeField.slice(1);
            const userField = interaction.options.getMember('user');

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

            const getTimestamp = new Date();

            const addLog = new EmbedBuilder()
                .setTitle('Logs')
                .addFields(
                    { name: 'Type', value: `${resultType}` },
                    { name: 'User', value: `${userField.user.username} \`${userField.user.id}\`` },
                    { name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
                    { name: 'Reason', value: `${reasonField}` },
                    { name: 'Timestamp', value: `${getTimestamp}` }
                )
                .setColor(configuration.embedColor);

            try {
                await Log.findOneAndUpdate({
                    'guild.id': interaction.guild.id
                }, {
                    $push: {
                        items: {
                            type: resultType,
                            user: {
                                name: userField.user.username,
                                id: userField.user.id
                            },
                            staff: {
                                name: interaction.user.username,
                                id: interaction.user.id
                            },
                            reason: reasonField,
                            timestamp: getTimestamp
                        }
                    }
                });
            }
            catch (err) {
                console.error(err);
            }

            return interaction.editReply({ embeds: [addLog] });
        }

        // log initialize Subcommand
        if (interaction.options.getSubcommand() === 'initialize') {
            await interaction.deferReply();

            let guildLog = await Log.findOne({ 'guild.id': interaction.guild.id });

            if (guildLog) {
                const logAlreadyExist = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('This guild already initialized moderation logs.')
                    .setColor('#ff5555');

                return interaction.editReply({ embeds: [logAlreadyExist] });
            }

            if (!guildLog) {
                guildLog = await new Log({
                    _id: new mongoose.Types.ObjectId(),
                    guild: {
                        name: interaction.guild.name,
                        id: interaction.guild.id
                    },
                    items: []
                });

                await guildLog.save().then(() => {
                    console.log(`${chalk.white.bold(`[MongoDB] Initialized moderation logs for ${interaction.guild.name} (${interaction.guild.id})`)}`);

                    const createLog = new EmbedBuilder()
                        .setTitle('Logs')
                        .setDescription(`Successfully initialized moderation logs for **${interaction.guild.name}**`)
                        .setColor(configuration.embedColor)
                        .setTimestamp();

                    interaction.editReply({ embeds: [createLog] });
                })
                .catch(console.error);

                return [guildLog];
            }
        }

        // log view Subcommand
        if (interaction.options.getSubcommand() === 'view') {
            await interaction.deferReply({ ephemeral: true });

            const guildLog = await Log.findOne({ 'guild.id': interaction.guild.id });
                if (guildLog === null) return interaction.editReply({ embeds: [global.errors[5]] });

            const viewLog = new EmbedBuilder()
                .setTitle('Logs')
                .setColor(configuration.embedColor);

            // Display 10 latest items from the log
            const latestItems = guildLog.items.slice(-10);

            let description = '';
            if (latestItems.length > 0) {
                latestItems.forEach(item => {
                    description += `\n**Type:** ${item.type}\n**User:** ${item.user.name ? item.user.name : ''} \`${item.user.id}\`\n**By:** ${item.staff.name} \`${item.staff.id}\`\n**Reason:** ${item.reason}\n**Timestamp:** ${item.timestamp}\n`;
                });
            }
            else {
                description = '*No history found.*';
            }

            viewLog.setDescription(description);

            return interaction.editReply({ embeds: [viewLog] });
        }

	}
};