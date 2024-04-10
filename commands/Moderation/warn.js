const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Log = require('../../schemas/log');
const getTimestamp = new Date();

module.exports = {
	data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    category: 'Moderation',
    guildOnly: true,
    async execute (interaction) {
        const guildLog = await Log.findOne({ 'guild.id': interaction.guild.id });
            if (guildLog === null) return interaction.reply({ embeds: [global.errors[5]] });

        if (!interaction.guild.members.me.permissions.has('ManageMessages')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Messages** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageMessages')) return interaction.reply({ embeds: [global.errors[2]] });

            const userField = interaction.options.getMember('user');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot warn a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot warn yourself.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const embedUserDM = new EmbedBuilder()
            .setTitle('Warn')
            .addFields(
                { name: 'Guild', value: `${interaction.guild.name}` },
                { name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
                { name: 'Reason', value: `${reasonField}` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        const embed = new EmbedBuilder()
			.setTitle('Warn')
			.addFields(
				{ name: 'User', value: `${userField.user.username} \`${userField.user.id}\`` },
				{ name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
				{ name: 'Reason', value: `${reasonField}` }
			)
			.setTimestamp()
			.setColor('#ff0000');

        try {
            await Log.findOneAndUpdate({
                'guild.id': interaction.guild.id
            }, {
                $push: {
                    items: {
                        type: 'Warn',
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

        userField.send({ embeds: [embedUserDM] })
            .then(() => {
                interaction.reply({ embeds: [embed] });
            })
            .catch(() => {
                interaction.reply({ embeds: [global.errors[3]] });
            });
        }
};