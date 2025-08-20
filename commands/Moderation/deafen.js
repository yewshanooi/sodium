const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deafen')
        .setDescription('Deafen the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    category: 'Moderation',
    guildOnly: true,
    async execute (interaction) {
        const guildDB = await Guild.findOne({ 'guild.id': interaction.guild.id });
            if (!guildDB) return interaction.reply({ embeds: [global.errors[5]] });

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.DeafenMembers)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Deafen Members** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.DeafenMembers)) return interaction.reply({ embeds: [global.errors[2]] });

            const userField = interaction.options.getMember('user');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot deafen a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot deafen yourself.' });

                const Guild = interaction.client.guilds.cache.get(interaction.guild.id);
                const Member = Guild.members.cache.get(userField.user.id);
                    if (!Member.voice.channel) return interaction.reply({ content: 'Error: This user is currently not in a voice channel.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const getId = new mongoose.Types.ObjectId();

        const embed = new EmbedBuilder()
            .setTitle('Deafen')
            .setDescription(`\`${getId}\``)
            .addFields(
                { name: 'User', value: `${userField.user.username} \`${userField.user.id}\`` },
                { name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
                { name: 'Reason', value: `${reasonField}` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        try {
            await Guild.findOneAndUpdate({
                'guild.id': interaction.guild.id
            }, {
                $push: {
                    logs: {
                        _id: getId,
                        type: 'Deafen',
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

        return interaction.reply({ embeds: [embed] }).then(userField.voice.setDeaf(true));
	}
};