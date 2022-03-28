const { SlashCommandBuilder } = require('@discordjs/builders');

const { getLeaderboard, getUserStarCount, giveStars, setStarCount, takeStars } = require('../aws-helper.js');
const { makeUserString } = require('../util.js');

const guildId = '953894755450908692';


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stars')
		.setDescription('Logan stars tracking.')

		.addSubcommand(subcommand => 
			subcommand
				.setName('check')
				.setDescription('Check a user\'s star count.')
				.addUserOption(option => option.setName('user').setDescription('The user, or yourself if empty.')))

		.addSubcommand(subcommand => 
			subcommand
				.setName('give')
				.setDescription('Give a user a number of stars, default is 1.')
				.addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
				.addIntegerOption(option => option.setName('number').setDescription('The number of stars to give, default is 1.')))

		.addSubcommand(subcommand => 
			subcommand
				.setName('leaderboard')
				.setDescription('List the current leaders.')
				.addIntegerOption(option => option.setName('number').setDescription('The number of users to display, default is 3.')))

		.addSubcommand(subcommand => 
			subcommand
				.setName('loserboard')
				.setDescription('List the current losers.')
				.addIntegerOption(option => option.setName('number').setDescription('The number of users to display, default is 3.')))

		.addSubcommand(subcommand => 
			subcommand
				.setName('take')
				.setDescription('Take stars from a user.')
				.addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
				.addIntegerOption(option => option.setName('number').setDescription('The number of stars to take, default is 1.'))),

	async execute(interaction) {

		const subcommand = interaction.options.getSubcommand();

		// CHECK
		if (subcommand === 'check') {
			const user = interaction.options.getUser('user') ?? interaction.user;
			getUserStarCount(user, guildId).then(
				numStars => interaction.reply(makeUserString(user.username, numStars))
			);

		// GIVE	
		} else if (subcommand === 'give') {
			const user = interaction.options.getUser('user') ?? interaction.user;
			const numStars = interaction.options.getInteger('number') ?? 1;
			giveStars(user, guildId, numStars).then(
				numStars => interaction.reply(makeUserString(user.username, numStars))
			);

		// TAKE	
		} else if (subcommand === 'take') {
			const user = interaction.options.getUser('user') ?? interaction.user;
			const numStars = interaction.options.getInteger('number') ?? 1;
			takeStars(user, guildId, numStars).then(
				numStars => interaction.reply(makeUserString(user.username, numStars))
			);
		}
	}
};