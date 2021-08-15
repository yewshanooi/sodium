const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'roleadd',
    description: 'Add role to tagged user',
    usage: 'roleadd {@user} {@role}',
    cooldown: '15',
    guildOnly: true,
    execute (message, args) {
        if (!message.member.permissions.has('MANAGE_ROLES')) return message.channel.send('Error: You have no permission to use this command.');

            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                if (!user) return message.channel.send('Error: Please provide a valid user.');

            const taggedRole = message.guild.roles.cache.find(ra => ra.name === args[1]) || message.guild.roles.cache.find(ra => ra.id === args[1]) || message.mentions.roles.first();
                if (!taggedRole) return message.channel.send('Error: Please provide a valid role.');
                if (user.roles.cache.has(taggedRole.id)) return message.channel.send('Error: This user already have the role.');

            const embed = new MessageEmbed()
                .setTitle('Role Add')
                .setDescription(`Successfully added **${taggedRole}** role to user **${user}**`)
                .setTimestamp()
                .setColor(embedColor);
            message.channel.send({ embeds: [embed] }).then(user.roles.add(taggedRole.id));
        }
};