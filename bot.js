require('dotenv').config();

const { capitalize, makeUserString } = require('./util.js');
const { getLeaderboard, getUserStarCount, giveStars, setStarCount, takeStars } = require('./aws-helper.js');
const { parseArgs } = require('./argumentParser.js');

var Discord = require('discord.io');
var logger = require('winston');
const { parse } = require('dotenv');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
    token: process.env.DISCORD_BOT_TOKEN,
    autorun: true
});

bot.on('ready', function (evt) { logger.info('Connected'); });

function sendStarCountMessage(channelId, username, num) {
    bot.sendMessage({
        to: channelId,
        message: makeUserString(username, num)
    })
}

bot.on('message', function (user, userID, channelID, message, evt) {

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!stars`

    if (message.startsWith("!stars")) {

        console.log(user, userID);

        var args = message.split(" ");
        args.shift();   

        args = parseArgs(args, user.toLowerCase());

        const username = args.username;
        const quantity = args.quantity;

        switch(args.command) {

            case "give":
                giveStars(username, quantity).then(
                    numStars => sendStarCountMessage(channelID, username, numStars)
                );
                break;

            case "set":
                setStarCount(username, quantity).then(
                    numStars => sendStarCountMessage(channelID, username, numStars)
                )
                break;

            case "take":
                takeStars(username, quantity).then(
                    numStars => sendStarCountMessage(channelID, username, numStars)
                )
                break;

            case "query":
                getUserStarCount(username).then(
                    numStars => sendStarCountMessage(channelID, username, numStars)
                );
                break;

            case "loserboard":
            case "leaderboard":
                getLeaderboard(args.numUsers, args.isLoserboard).then(
                    users => {
                        const userStrings = users.map(u => makeUserString(u.id, u.quantity));
                        bot.sendMessage({
                            to: channelID,
                            message: userStrings.join("\n")
                        });
                    }
                );
                break;
        }


    }
});