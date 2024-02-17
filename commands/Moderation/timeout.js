const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Log = require('../../schemas/log');
const getTimestamp = new Date();

module.exports = {
	data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Select a duration').addChoices({ name: '60 seconds', value: 60000 }, { name: '5 minutes', value: 300000 }, { name: '10 minutes', value: 600000 }, { name: '1 hour', value: 3.6e+6 }, { name: '1 day', value: 8.64e+7 }, { name: '1 week', value: 6.048e+8 }).setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    category: 'Moderation',
    guildOnly: true,
    async execute (interaction) {
        const guildLog = await Log.findOne({ guildId: interaction.guild.id });
            if (guildLog === null) return interaction.reply({ embeds: [global.errors[5]] });

        if (!interaction.guild.members.me.permissions.has('ModerateMembers')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Moderate Members** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ModerateMembers')) return interaction.reply({ embeds: [global.errors[2]] });

            const userField = interaction.options.getMember('user');
            const durationField = interaction.options.getInteger('duration');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot timeout a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot timeout yourself.' });

                if (userField.isCommunicationDisabled() === true) return interaction.reply({ content: 'Error: This user is already being timeout.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

            let resultDuration;
                if (durationField === 60000) resultDuration = '60 seconds';
                if (durationField === 300000) resultDuration = '5 minutes';
                if (durationField === 600000) resultDuration = '10 minutes';
                if (durationField === 3.6e+6) resultDuration = '1 hour';
                if (durationField === 8.64e+7) resultDuration = '1 day';
                if (durationField === 6.048e+8) resultDuration = '1 week';

        const embed = new EmbedBuilder()
			.setTitle('Timeout')
			.addFields(
				{ name: 'User', value: `${userField.user.username} \`${userField.user.id}\`` },
				{ name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
                { name: 'Duration', value: `${resultDuration}` },
				{ name: 'Reason', value: `${reasonField}` }
			)
			.setTimestamp()
			.setColor('#ff0000');

        try {
            await Log.findOneAndUpdate({
                guildId: interaction.guild.id
            }, {
                $push: {
                    items: {
                        type: 'Timeout',
                        user: {
                            name: userField.user.username,
                            id: userField.user.id
                        },
                        mod: {
                            name: interaction.user.username,
                            id: interaction.user.id
                        },
                        duration: resultDuration,
                        reason: reasonField,
                        timestamp: getTimestamp
                    }
                }
            });
        }
        catch (err) {
            console.error(err);
        }

        return interaction.reply({ embeds: [embed] }).then(userField.timeout(durationField, reasonField));
    }
};