const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'leave',
    description: 'Remove the bot from the current guild',
    usage: 'leave {guild name}',
    cooldown: '45',
    guildOnly: true,
    execute (message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('Error: You have no permission to use this command.');

            const guildName = args.join(' ');
                if (!guildName) return message.channel.send('Error: Please provide the current guild name.');

                const embedTrue = new MessageEmbed()
                    .setTitle('Leave')
                    .setDescription('Successfully left the guild.\n We hope to see you again next time!')
                    .setColor(embedColor);

                const buttonTrue = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setURL('https://discord.com/api/oauth2/authorize?client_id=531811937244151808&permissions=261993005047&scope=bot%20applications.commands')
                        .setLabel('Already missed us? Invite us back')
                        .setStyle('LINK'));

            if (guildName === message.guild.name) {
                message.guild.leave().then(message.channel.send({ embeds: [embedTrue], components: [buttonTrue] }));
            }
            else {
                return message.channel.send('Error: Incorrect guild name.');
            }
        }
};