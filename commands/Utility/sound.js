const { SlashCommandBuilder, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch').default;

const myInstantsAPI = 'https://myinstants-api.vercel.app';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sound')
        .setDescription('Search and play a sound from MyInstants.')
        .addStringOption(option =>
            option.setName('keyword')
                .setDescription('The keyword to search for a sound.')
                .setRequired(false))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The voice channel you want the bot to join.')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(false)),
    cooldown: '10',
    category: 'Utility',
    guildOnly: true,
    async execute (interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const memberVoiceChannel = interaction.member?.voice.channel;
        const targetVoiceChannel = interaction.options.getChannel('channel');

        let voiceChannelToJoin;

        if (targetVoiceChannel) {
            if (targetVoiceChannel.members.size > 0) {
                voiceChannelToJoin = targetVoiceChannel;
            } else {
                return interaction.editReply({ content: 'The specified voice channel is empty. Please specify a channel with members or join one yourself.', ephemeral: true });
            }
        } else if (memberVoiceChannel) {
            voiceChannelToJoin = memberVoiceChannel;
        } else {
            return interaction.editReply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }

        const query = interaction.options.getString('keyword');
        let apiUrl;
        let apiData;
        
        try {
            if (query) {
                apiUrl = `${myInstantsAPI}/search?q=${encodeURIComponent(query)}`;
            } else {
                apiUrl = `${myInstantsAPI}/trending?q=us`;
            }

            const response = await fetch(apiUrl);
            apiData = await response.json();

            if (response.status !== 200 || !apiData.data || apiData.data.length === 0) {
                return interaction.editReply({ content: '🤷‍♂️ No sounds found matching your search.', ephemeral: true });
            }

        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: '❌ An error occurred while communicating with the MyInstants API.', ephemeral: true });
        }
        
        const results = apiData.data.slice(0, 5);
        const description = results.map((sound, index) => `${index + 1}. **[${sound.title}](${sound.mp3})**`).join('\n');

        const embed = new EmbedBuilder()
            .setTitle(`🎶 Search Results`)
            .setDescription(description)
            .setColor('Random')
            .setFooter({ text: 'Click a button to add the sound to the queue. (30s)' });

        const buttons = new ActionRowBuilder()
            .addComponents(
                ...results.map((_, index) =>
                    new ButtonBuilder()
                        .setCustomId(`sound_select_${index}_${interaction.id}`)
                        .setLabel(`${index + 1}`)
                        .setStyle(ButtonStyle.Primary)
                )
            );
        
        const responseMessage = await interaction.editReply({ embeds: [embed], components: [buttons], ephemeral: true });

        const collector = responseMessage.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id && i.customId.startsWith(`sound_select_`),
            time: 60000,
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();
            
            const selectedIndex = parseInt(i.customId.split('_')[2]);
            const selectedSound = results[selectedIndex];

            try {
                let player = client.manager?.players.get(interaction.guild.id);
                
                if (!player) {
                    player = client.manager.create({
                        guild: interaction.guild.id,
                        voiceChannel: voiceChannelToJoin.id,
                        textChannel: interaction.channel.id,
                        volume: 100,
                        selfDeafen: true
                    });
                    player.connect();
                }

                if (player.voiceChannel !== voiceChannelToJoin.id) {
                    player.setVoiceChannel(voiceChannelToJoin.id);
                }

                const res = await player.search(selectedSound.mp3, interaction.user);
                
                if (!res || !res.tracks.length) {
                    return i.editReply({ content: 'Could not retrieve the audio for the sound. Please try again.', ephemeral: true });
                }

                const track = res.tracks[0];
                track.title = selectedSound.title;
                track.author = selectedSound.author||"MyInstants";
                track.uri = selectedSound.mp3;
                track.requester = interaction.user;
                track.secret = true; // Mark the track as secret to avoid sending messages to the text channel

                player.queue.add(track);

                if (!player.playing && !player.paused && !player.queue.size) {
                    player.play();
                }

                const confirmationEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`🎶 **Sound added to the queue:** \n \`${selectedSound.title}\` by <@${i.user.id}>`);

                await i.followUp({ embeds: [confirmationEmbed], components: [], ephemeral: true });

            } catch (error) {
                await i.editReply({ content: `An error occurred while processing your request: ${error.message}`, components: [], ephemeral: true });
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                const expiredEmbed = new EmbedBuilder()
                    .setDescription('The time to select a sound has expired.')
                    .setColor('Grey');
                try {
                    await interaction.editReply({ embeds: [expiredEmbed], components: [], ephemeral: true });
                } catch (error) {
                    console.log('The message has already been edited or could not be edited when the collector ended.');
                }
            }
        });
    },
};