const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Log = require('../../schemas/log');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '25',
    category: 'Moderation',
    guildOnly: true,
	async execute (interaction) {
        const guildLog = await Log.findOne({ 'guild.id': interaction.guild.id });
            if (guildLog === null) return interaction.reply({ embeds: [global.errors[5]] });

        if (!interaction.guild.members.me.permissions.has('BanMembers')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Ban Members** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('BanMembers')) return interaction.reply({ embeds: [global.errors[2]] });

            const userField = interaction.options.getMember('user');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot ban a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot ban yourself.' });

                if (userField.user.id === interaction.guild.ownerId) return interaction.reply({ content: 'Error: You cannot ban a Guild Owner.' });
                if (userField.permissions.has('Administrator')) return interaction.reply({ content: 'Error: You cannot ban a user with Administrator permission.' });

            let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

        const getId = new mongoose.Types.ObjectId();
        const getTimestamp = new Date();

        const embed = new EmbedBuilder()
            .setTitle('Ban')
            .setDescription(`\`${getId}\``)
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
                        _id: getId,
                        type: 'Ban',
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
        } catch (err) {
            console.error(err);
        }

        return interaction.reply({ embeds: [embed] }).then(userField.ban({ reason: reasonField }));
	}
};