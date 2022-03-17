const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('Display user\'s current Spotify status')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
    cooldown: '5',
    guildOnly: true,
    execute (interaction) {
        const memberField = interaction.options.getMember('user');
            if (memberField.user.bot === true) return interaction.reply({ content: 'Error: You cannot display a bot current Spotify status.' });
            if (memberField.presence === null) return interaction.reply({ content: 'Error: This user is offline or invisible.' });

            const noMusicEmbed = new MessageEmbed()
                .addField('**No Music**', 'This user is not listening to any music on Spotify!')
                .setColor('#1ed760');

                if (memberField.presence.activities.length === 0) return interaction.reply({ embeds: [noMusicEmbed] });
                if (memberField.presence.activities[0].name !== 'Spotify') return interaction.reply({ embeds: [noMusicEmbed] });

            if (memberField.presence.activities !== null && memberField.presence.activities[0].name === 'Spotify' && memberField.presence.activities[0].assets !== null) {

                const trackIMG = `https://i.scdn.co/image/${memberField.presence.activities[0].assets.largeImage.slice(8)}`;
                const trackName = memberField.presence.activities[0].details;
                const trackAlbum = memberField.presence.activities[0].assets.largeText;
                const trackURL = `https://open.spotify.com/track/${memberField.presence.activities[0].syncId}`;

                let trackAuthor = memberField.presence.activities[0].state;
                    trackAuthor = trackAuthor.replace(/;/g, ',');

                const embed = new MessageEmbed()
                    .setTitle(trackName)
                    .addFields(
                        { name: 'Artist', value: `${trackAuthor}` },
                        { name: 'Album', value: `${trackAlbum}` }
                    )
                    .setThumbnail(trackIMG)
                    .setFooter({ text: 'Powered by Spotify' })
                    .setColor('#1ed760');

                const button = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setURL(trackURL)
                        .setLabel('Listen to Track')
                        .setStyle('LINK'));

                interaction.reply({ embeds: [embed], components: [button] });
            }

    }
};