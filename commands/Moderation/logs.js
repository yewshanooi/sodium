const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Log = require('../../schemas/log');
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logs')
		.setDescription('View moderation logs for the current guild'),
	cooldown: '5',
	category: 'Moderation',
	guildOnly: true,
	async execute (interaction, configuration) {
        if (!interaction.member.permissions.has('Administrator')) return interaction.reply({ embeds: [global.errors[2]] });

        let guildLog = await Log.findOne({ guildId: interaction.guild.id });

        if (!guildLog) {
            guildLog = await new Log({
                _id: new mongoose.Types.ObjectId(),
                guildName: interaction.guild.name,
                guildId: interaction.guild.id,
                items: []
            });

            await guildLog.save().then(() => {
                console.log(`${chalk.white.bold(`[MongoDB] Initialized moderation logs for ${interaction.guild.name} (${interaction.guild.id})`)}`);

                const createLog = new EmbedBuilder()
                    .setTitle('Logs')
                    .setDescription(`Successfully initialized moderation logs for **${interaction.guild.name}**`)
                    .setColor(configuration.embedColor)
                    .setTimestamp();

                interaction.reply({ embeds: [createLog] });
            })
            .catch(console.error);
        return [guildLog];
        }

        const viewLog = new EmbedBuilder()
            .setTitle('Logs')
            .setColor(configuration.embedColor);

        // Display the 10 latest moderation logs for the current guild
        const latestItems = guildLog.items.slice(-10);

        let description = '';
        if (latestItems.length > 0) {
            latestItems.forEach(item => {
                description += `\n**Type:** ${item.type}\n**User:** ${item.user.name ? item.user.name : ''} \`${item.user.id}\`\n**By:** ${item.mod.name} \`${item.mod.id}\`\n`;
                    if (item.duration) {
                        description += `**Duration:** ${item.duration}\n`;
                    }
                description += `**Reason:** ${item.reason}\n**Timestamp:** ${item.timestamp}\n`;
            });
        }
        else {
            description = '*No history found.*';
        }

        viewLog.setDescription(description);

        return interaction.reply({ embeds: [viewLog], ephemeral: true });

	}
};

// [To-Do] Add subcommands: logs [create | view | delete], etc.

// [To-Do] Add logs with subcommands to README.md - Commands > Moderation.