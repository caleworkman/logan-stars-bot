const { SlashCommandBuilder } = require('@discordjs/builders');

const { getLeaderboard, getUserStarCount, giveStars, takeStars } = require('../aws-helper.js');
const { makeUserString } = require('../util.js');

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
		const guildId = interaction.guildId;
		const user = interaction.options.getUser('user') ?? interaction.user;

		const hasPermission = interaction.member.roles.cache.some(role => role.name.toLowerCase() === 'admin');

		switch(subcommand) {
			
			case "check":
				getUserStarCount(user, guildId).then(
					numStars => interaction.reply(makeUserString(user.username, numStars))
				);
				break;

			case "give":
				if (!hasPermission) break;
				const numStarsToGive = interaction.options.getInteger('number') ?? 1;
				giveStars(user, guildId, numStarsToGive).then(
					numStars => interaction.reply(makeUserString(user.username, numStars))
				);
				break;

			case "take":
				if (!hasPermission) break;
				const numStarsToTake = interaction.options.getInteger('number') ?? 1;
				takeStars(user, guildId, numStarsToTake).then(
					numStars => interaction.reply(makeUserString(user.username, numStars))
				);
				break;

			case "loserboard":
			case "leaderboard":
				const numUsers = interaction.options.getInteger('number') ?? 3;
				getLeaderboard(numUsers, subcommand === 'loserboard').then(
                    users => {
                        const userStrings = users.map(u => makeUserString(u.username, u.quantity));
                        interaction.reply(userStrings.join("\n"));
                    }
                );
                break;
		}

	}
};