require('dotenv').config();

const { makeUserString } = require('./util.js');
const { getLeaderboard, getUserStarCount, giveStars, setStarCount, takeStars } = require('./aws-helper.js');
const { parseArgs } = require('./argumentParser.js');

const { Client, Intents } = require('discord.js');
const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

bot.login(process.env.DISCORD_BOT_TOKEN);

var logger = require('winston');
const { parse } = require('dotenv');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Protect some functions
const zeserothId = '257311791099412491';
const azuId = '187077881749307392';
const myId = '228727476589690881';
const permittedUsers = [myId, azuId, zeserothId];

bot.on('messageCreate', message => {

    console.log('env:', process.env.NODE_ENV)

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!stars`

    // Don't respond to other bots.
    if (message.author.bot) return;

    if (message.content.startsWith("!stars")) {

        var args = message.content.split(" ");
        args.shift();   

        args = parseArgs(args, message.author.username.toLowerCase());

        const username = args.username;
        const quantity = args.quantity;

        const userId = message.author.id;
        const hasPermission = permittedUsers.includes(userId);

        switch(args.command) {

            case "give":
                if (!hasPermission) break;
                giveStars(username, quantity).then(
                    numStars => message.channel.send(makeUserString(username, numStars))
                );
                break;

            case "set":
                if (!hasPermission) break;
                setStarCount(username, quantity).then(
                    numStars => message.channel.send(makeUserString(username, numStars))
                )
                break;

            case "take":
                if (!hasPermission) break;
                takeStars(username, quantity).then(
                    numStars => message.channel.send(makeUserString(username, numStars))
                )
                break;

            case "query":
                getUserStarCount(username).then(
                    numStars => message.channel.send(makeUserString(username, numStars))
                );
                break;

            case "loserboard":
            case "leaderboard":
                getLeaderboard(args.numUsers, args.isLoserboard).then(
                    users => {
                        const userStrings = users.map(u => makeUserString(u.id, u.quantity));
                        message.channel.send(userStrings.join("\n"));
                    }
                );
                break;
        }
    }
    
});