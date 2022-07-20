const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor } = require('../config.json');
const privateDM = require('../errors/privateDM.js');

const roasts = [
    'Bards will chant parables of your legendary stupidity for centuries, You',
    'Don\'t play hard to get when you are hard to want',
    'Don\'t you worry your pretty little head about it. The operative word being little. Not pretty.',
    'Get a damn life you uncultured cranberry fucknut.',
    'God wasted a good asshole when he put teeth in your mouth',
    'Goddamn did your parents dodge a bullet when they abandoned you.',
    'I bet your dick is an innie and your belly button an outtie.',
    'I can\'t even call you fucking ugly, because nature has already beaten me to it.',
    'I cant wait to forget you.',
    'I don\'t have the time, or the crayons to explain this to you.',
    'I fucking hate the way you laugh.',
    'I hope you win the lottery and lose your ticket.',
    'I once smelled a dog fart that had more cunning, personality, and charm than you.',
    'I shouldn\'t roast you, I can\'t imagine the pain you go through with that face!',
    'I wonder if you\'d be able to speak more clearly if your parents were second cousins instead of first.',
    'I would call you a cunt, but you lack the warmth or the depth.',
    'I would challenge you to a battle of wits, but it seems you come unarmed',
    'I\'d love to stay and chat but I\'d rather have type-2 diabetes',
    'I\'m just surprised you haven\'t yet retired from being a butt pirate.',
    'I\'m not mad. I\'m just... disappointed.',
    'I\'ve never met someone who\'s at once so thoughtless, selfish, and uncaring of other people\'s interests, while also having such lame and boring interests of his own. You don\'t have friends, because you shouldn\'t.',
    'I\'m betting your keyboard is filthy as fuck now from all that Cheeto-dust finger typing, you goddamn weaboo.',
    'If unenthusiastic handjob had a face, your profile picture would be it.',
    'If there was a single intelligent thought in your head it would have died from loneliness.',
    'If you were a potato you\'d be a stupid potato.',
    'If you were an inanimate object, you\'d be a participation trophy.',
    'If you where any stupider we\'d have to water you',
    'It\'s a joke, not a dick. You don\'t have to take it so hard.',
    'May the fleas of ten thousand camels live happily upon your buttocks',
    'Maybe if you eat all that makeup you will be beautiful on the inside.',
    'Next time, don\'t take a laxative before you type because you just took a steaming stinking dump right on the page. Now wipe that shit up and don\'t fuck it up like your life.',
    'Not even your dog loves you. He\'s just faking it.',
    'People don\'t even pity you.',
    'Take my lowest priority and put yourself beneath it.',
    'The IQ test only goes down to zero but you make a really compelling case for negative numbers',
    'the only thing you\'re fucking is natural selection',
    'There are two ugly people in this chat, and you\'re both of them.',
    'There will never be enough middle fingers in this world for you',
    'They don\'t make a short enough bus in the Continental United States for a person like you.',
    'Twelve must be difficult for you. I don\'t mean BEING twelve, I mean that being your IQ.',
    'We all dislike you, but not quite enough that we bother to think about you.',
    'Were you born a cunt, or is it something you have to recommit yourself to every morning?',
    'What\'s the difference between three dicks and a joke? You can\'t take a joke.',
    'When you die, people will struggle to think of nice things to say about you.',
    'Where\'d ya get those pants? The toilet store?',
    'Why don\'t you crawl back to whatever micro-organism cesspool you came from, and try not to breath any of our oxygen on the way there',
    'You are a pizza burn on the roof of the world\'s mouth.',
    'You are dumber than a block of wood and not nearly as useful',
    'You are like the end piece of bread in a loaf, everyone touches you but no one wants you',
    'You have more dick in your personality than you do in your pants',
    'You have the face of a bulldog licking piss off a stinging nettle.',
    'You know they say 90% of dust is dead human skin? That\'s what you are to me.',
    'You losing your virginity is like a summer squash growing in the middle of winter. Never happening.',
    'You may think people like being around you- but remember this: there is a difference between being liked and being tolerated.',
    'You might want to get a colonoscopy for all that butthurt',
    'You need to go up to your daddy, get on your knees and apologize to each and every brother and sister that didn\'t make it to your mother\'s egg before you',
    'You should put a condom on your head, because if you\'re going to act like a dick you better dress like one too.',
    'You stuck up, half-witted, scruffy looking nerf herder!',
    'You were birthed out your mothers ass because her cunt was too busy.',
    'You\'re impossible to underestimate',
    'You\'re kinda like Rapunzel except instead of letting down your hair you let down everyone in your life',
    'You\'re like a penny on the floor of a public restroom - filthy, untouchable and practically worthless.',
    'You\'re like a square blade, all edge and no point.',
    'You\'re not pretty enough to be this dumb',
    'You\'re objectively unattractive.',
    'You\'re so dense, light bends around you.',
    'You\'re so salty you would sink in the Dead Sea',
    'You\'re so stupid you couldn\'t pour piss out of a boot if the directions were written on the heel',
    'Your birth certificate is an apology letter from the abortion clinic.',
    'Your mother may have told you that you could be anything you wanted, but a douchebag wasn\'t what she meant.'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roast')
        .setDescription('Roasts the selected user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
    cooldown: '8',
    guildOnly: true,
    execute (interaction) {
        const userField = interaction.options.getUser('user');
            if (userField === interaction.client.user) return interaction.reply({ content: 'Error: You cannot roast the bot.' });
            if (userField.bot === true) return interaction.reply({ content: 'Error: You cannot roast a bot.' });

            if (userField === interaction.user) return interaction.reply({ content: 'Error: You cannot roast yourself.' });

        const embed = new EmbedBuilder()
            .setTitle('Roast')
            .setDescription(`${roasts[Math.floor(Math.random() * roasts.length)]}\n\n*from \`${interaction.user.tag}\`*`)
            .setColor(embedColor);

        const successEmbed = new EmbedBuilder()
            .setDescription(`Successfully roasted ${userField}`)
            .setColor(embedColor);

        userField.send({ embeds: [embed] })
            .then(() => {
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
            })
            .catch(() => {
                interaction.reply({ embeds: [privateDM] });
            });
        }
};