const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { getGuildLog, addLogItem, initializeGuildLog, removeLogItem } = require('../../scheme');
const chalk = require('chalk');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Add, initialize, remove, or view logs for moderation commands')
        .addSubcommand(subcommand => subcommand.setName('add').setDescription('Add a new log entry')
            .addStringOption(option => option.setName('type').setDescription('Select a type').addChoices({ name: 'Ban', value: 'ban' }, { name: 'Deafen', value: 'deafen' }, { name: 'Kick', value: 'kick' }, { name: 'Timeout', value: 'timeout' }, { name: 'Unban', value: 'unban' }, { name: 'Undeafen', value: 'undeafen' }, { name: 'Untimeout', value: 'untimeout' }, { name: 'Warn', value: 'warn' }).setRequired(true))
            .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
            .addStringOption(option => option.setName('reason').setDescription('Enter a reason')))
        .addSubcommand(subcommand => subcommand.setName('initialize').setDescription('Initialize moderation logs for current guild'))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove an existing log entry by ID')
            .addStringOption(option => option.setName('log_id').setDescription('Enter a log id').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('view').setDescription('Show the 10 latest log entries')),
	cooldown: '5',
	category: 'Moderation',
	guildOnly: true,
	async execute (interaction, configuration) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ embeds: [global.errors[2]] });
        const guildLog = await getGuildLog(interaction.client, interaction.guild.id);
        // log add Subcommand
        if (interaction.options.getSubcommand() === 'add') {
            await interaction.deferReply();
			if (guildLog === null) return interaction.editReply({ embeds: [global.errors[5]] });

            const typeField = interaction.options.getString('type');
                const resultType = typeField.charAt(0).toUpperCase() + typeField.slice(1);
            const userField = interaction.options.getMember('user');

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

            const getId = await addLogItem(interaction.client, interaction.guild.id, resultType, userField.user, interaction.user, reasonField);

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

            return interaction.editReply({ embeds: [addLog] });
        }

        // log initialize Subcommand
        if (interaction.options.getSubcommand() === 'initialize') {
            await interaction.deferReply();

            if (guildLog) {
                const logAlreadyExist = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('This guild already initialized moderation logs.')
                    .setColor('#ff5555');

                return interaction.editReply({ embeds: [logAlreadyExist] });
            } else {
                await initializeGuildLog(interaction.client, interaction);

				console.log(`${chalk.white.bold(`[MongoDB] Initialized moderation logs for ${interaction.guild.name} (${interaction.guild.id})`)}`);

				const createLog = new EmbedBuilder()
					.setTitle('Logs')
					.setDescription(`Successfully initialized moderation logs for **${interaction.guild.name}**`)
					.setColor(configuration.embedColor)
					.setTimestamp();

				return interaction.editReply({ embeds: [createLog] });
            }
        }

        // log remove Subcommand
        if (interaction.options.getSubcommand() === 'remove') {
            await interaction.deferReply();
            if (guildLog === null) return interaction.editReply({ embeds: [global.errors[5]] });

            if (guildLog.items.length > 0) {
				const logIdField = interaction.options.getString('log_id');
				
				const wasRemoved = await removeLogItem(interaction.client, interaction.guild.id, logIdField);

				if (wasRemoved) {
					const removeLog = new EmbedBuilder()
						.setTitle('Logs')
						.setDescription(`Successfully removed log entry with ID of **${logIdField}**`)
						.setColor(configuration.embedColor)
						.setTimestamp();

					return interaction.editReply({ embeds: [removeLog] });
				} else {
					return interaction.editReply({ content: 'Error: No log entry found with that ID.' });
				}
			} else {
				return interaction.editReply({ content: 'Error: No log history found.' });
			}
        }

        // log view Subcommand
        if (interaction.options.getSubcommand() === 'view') {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            
            if (guildLog === null) return interaction.editReply({ embeds: [global.errors[5]] });

            const viewLog = new EmbedBuilder()
                .setTitle('Logs')
                .setColor(configuration.embedColor);

            // Display 10 latest items from the log
            const latestItems = guildLog.items.slice(-10);

			let description = '';
			if (latestItems.length > 0) {
				latestItems.forEach(item => {
					description += `\n**Type:** ${item.type} \`${item._id}\`\n**User:** ${item.user.name ? item.user.name : ''} \`${item.user.id}\`\n**By:** ${item.staff.name} \`${item.staff.id}\`\n**Reason:** ${item.reason}\n**Timestamp:** ${item.timestamp}\n`;
				});
			} else {
				description = '*No history found.*';
			}

			viewLog.setDescription(description);

			return interaction.editReply({ embeds: [viewLog] });
        }

	}
};