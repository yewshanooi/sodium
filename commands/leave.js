const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'leave',
    description: 'Remove the bot from the current guild',
    usage: 'leave',
    cooldown: '35',
    guildOnly: true,
    execute (message) {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Error: You have no permission to use this command.');

            const embedRequest = new MessageEmbed()
                .setTitle('Leave')
                .setDescription('Are you sure you want to remove the bot from this guild?')
                .setColor(embedColor);

            const embedPassed = new MessageEmbed()
                .setTitle('Leave')
                .setDescription('Successfully left the guild. We hope to see you again next time!')
                .addField('Already missed us? Invite us back -', '[*discord.com*](https://discord.com/api/oauth2/authorize?client_id=531811937244151808&permissions=8&scope=bot%20applications.commands)')
                .setTimestamp()
                .setColor(embedColor);

            message.channel.send(embedRequest);

                message.react('🟩').then(() => message.react('🟥'));
                const filter = (reaction, user) => ['🟩', '🟥'].includes(reaction.emoji.name) && user.id === message.author.id;

                message.awaitReactions(filter, { max: 1 })
                    .then(collected => {
                    const reaction = collected.first();

                        if (reaction.emoji.name === '🟩') {
                            message.channel.bulkDelete(1, true).then(message.channel.send(embedPassed)
                                .then(setTimeout(() => {
                                    message.guild.leave();
                                }, 3000)));
                        }
                        else {
                            message.channel.bulkDelete(1, true).then(message.channel.send('Error: Failed to leave current guild.'));
                        }
                });
        }
};