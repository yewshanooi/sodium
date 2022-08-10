const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('Display user\'s current Spotify status')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
    cooldown: '5',
    guildOnly: true,
    execute (interaction, configuration, errors) {
        const userField = interaction.options.getMember('user');
            if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot display a bot current Spotify status.' });
            if (userField.presence === null) return interaction.reply({ content: 'Error: This user is offline or invisible.' });

            const userNotListeningEmbed = new EmbedBuilder()
                .setTitle('No Music')
                .setDescription('This user is not listening to any music on Spotify!')
                .setFooter({ text: 'Powered by Spotify' })
                .setColor('#1ed760');

                if (userField.presence.activities.length === 0) return interaction.reply({ embeds: [userNotListeningEmbed] });
                if (userField.presence.activities[0].name !== 'Spotify') return interaction.reply({ embeds: [userNotListeningEmbed] });

        if (userField.presence.activities !== null && userField.presence.activities[0].name === 'Spotify' && userField.presence.activities[0].assets !== null) {

            const trackImage = `https://i.scdn.co/image/${userField.presence.activities[0].assets.largeImage.slice(8)}`;
            const trackName = userField.presence.activities[0].details;
            const trackAlbum = userField.presence.activities[0].assets.largeText;

                let trackAuthor = userField.presence.activities[0].state;
                    trackAuthor = trackAuthor.replace(/;/g, ',');

                const embed = new EmbedBuilder()
                    .setTitle(trackName)
                    .addFields(
                        { name: 'Artist', value: `${trackAuthor}` },
                        { name: 'Album', value: `${trackAlbum}` }
                    )
                    .setThumbnail(trackImage)
                    .setFooter({ text: 'Powered by Spotify' })
                    .setColor('#1ed760');
                interaction.reply({ embeds: [embed] });
            }

    }
};