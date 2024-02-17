const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Log = require('../../schemas/log');
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('log')
		.setDescription('Add, initialize, or view logs for moderation commands')
        .addSubcommand(subcommand => subcommand.setName('add').setDescription('Add a new entry in the log')
            .addStringOption(option => option.setName('type').setDescription('Select a type').addChoices({ name: 'Ban', value: 'ban' }, { name: 'Deafen', value: 'deafen' }, { name: 'Kick', value: 'kick' }, { name: 'Timeout', value: 'timeout' }, { name: 'Unban', value: 'unban' }, { name: 'Undeafen', value: 'undeafen' }, { name: 'Untimeout', value: 'untimeout' }, { name: 'Warn', value: 'warn' }).setRequired(true))
            .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
            .addStringOption(option => option.setName('reason').setDescription('Enter a reason')))
        .addSubcommand(subcommand => subcommand.setName('initialize').setDescription('Initialize moderation logs for the current guild'))
        .addSubcommand(subcommand => subcommand.setName('view').setDescription('View latest logs for the current guild (maximum of 10)')),
	cooldown: '5',
	category: 'Moderation',
	guildOnly: true,
	async execute (interaction, configuration) {
        await interaction.deferReply();

        if (!interaction.member.permissions.has('Administrator')) return interaction.editReply({ embeds: [global.errors[2]] });

        // log add Subcommand
        if (interaction.options.getSubcommand() === 'add') {
            const guildLog = await Log.findOne({ 'guild.id': interaction.guild.id });
                if (guildLog === null) return interaction.editReply({ embeds: [global.errors[5]] });

            // Collecting & organizing fields
            const typeField = interaction.options.getString('type');
                const resultType = typeField.charAt(0).toUpperCase() + typeField.slice(1);

            const userField = interaction.options.getMember('user');

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

            const getTimestamp = new Date();

            // Creating a Discord embed
            const addLog = new EmbedBuilder()
                .setTitle('Log')
                .addFields(
                    { name: 'Type', value: `${resultType}` },
                    { name: 'User', value: `${userField.user.username} \`${userField.user.id}\`` },
                    { name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
                    { name: 'Reason', value: `${reasonField}` },
                    { name: 'Timestamp', value: `${getTimestamp}` }
                )
                .setColor(configuration.embedColor);

            // Pushing fields into log as logItem
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
                            mod: {
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
                        .setTitle('Log')
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
            const guildLog = await Log.findOne({ 'guild.id': interaction.guild.id });
                if (guildLog === null) return interaction.editReply({ embeds: [global.errors[5]] });

            const viewLog = new EmbedBuilder()
                .setTitle('Log')
                .setColor(configuration.embedColor);

            // Display the 10 latest moderation logs for the current guild
            const latestItems = guildLog.items.slice(-10);

            let description = '';
            if (latestItems.length > 0) {
                latestItems.forEach(item => {
                    description += `\n**Type:** ${item.type}\n**User:** ${item.user.name ? item.user.name : ''} \`${item.user.id}\`\n**By:** ${item.mod.name} \`${item.mod.id}\`\n**Reason:** ${item.reason}\n**Timestamp:** ${item.timestamp}\n`;
                });
            }
            else {
                description = '*No history found.*';
            }

            viewLog.setDescription(description);

            return interaction.editReply({ embeds: [viewLog], ephemeral: true });
        }

	}
};