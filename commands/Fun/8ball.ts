import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8-ball for some psychic wisdom')
        .addStringOption(option => option.setName('question').setDescription('Enter a question').setRequired(true)),
    cooldown: 3,
    category: 'Fun',
    guildOnly: false,
    execute: (client, interaction) => {
        const questionField = interaction.options.getString('question', true);
        if (questionField.length > 255) {
			return interaction.reply({content: 'Your question is too long! Please keep it under 255 characters.'});
		}
        const embed = new EmbedBuilder()
            .setTitle(`${questionField}`)
            .setAuthor({
				name: '8ball',
				iconURL: 'https://i.imgur.com/HbwMhWM.png'
			})
            .addFields(
                { name: 'Answer', value: `${answers[Math.floor(Math.random() * answers.length)]}` }
            )
            .setColor(client.embedColor as any);
        interaction.reply({ embeds: [embed] });
    }
} as Command;

const answers = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Don\'t count on it.',
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
    'Absolutely not.',
    'Hell yes!',
    'No chance in hell.',
    'I wouldn’t bet on it.',
    'Go for it!',
    'Ask your mom.',
    'Why not?',
    'Definitely not, buddy.',
    'You already know the answer.',
    'Try again when you’re sober.',
    'Sounds promising.',
    'Doubtful, but possible.',
    '100% sure.',
    'That’s a terrible idea.',
    'Not today.',
    'In your dreams.',
    'If you believe in yourself, yes.',
    'LMAO, no.',
    'Only if you pay me.',
    'Strong yes.',
    'Nope. Next question.',
    'Ask again after coffee.',
    'Signs point to disaster.',
    'The universe says yes.',
    'You won’t like the answer.',
    'Maybe… maybe not.',
    'Stop asking stupid questions.',
    'Yes, but keep it a secret.',
    'Over my dead body.'
];