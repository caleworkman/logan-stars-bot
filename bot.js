require('dotenv').config();

const { capitalize, pluralize, repeatStars } = require('./util.js');
const { getUserStarCount, giveStars, setStarCount, takeStars } = require('./aws-helper.js');
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
        message: `${capitalize(username)}: ${repeatStars(num)} (${num})`
    })
}

bot.on('message', function (user, userID, channelID, message, evt) {

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!loganstars`

    if (message.startsWith("!stars")) {

        var args = message.split(" ");
        args.shift();   

        args = parseArgs(args);

        switch(args.command) {

            case "give":
                giveStars(args.username, args.quantity).then(
                    numStars => sendStarCountMessage(channelID, args.username, numStars)
                );
                break;

            case "set":
                setStarCount(args.username, args.quantity).then(
                    numStars => sendStarCountMessage(channelID, args.username, numStars)
                )
                break;

            case "take":
                takeStars(args.username, args.quantity).then(
                    numStars => sendStarCountMessage(channelID, args.username, numStars)
                )
                break;

            case "query":
                getUserStarCount(args.username).then(
                    numStars => sendStarCountMessage(channelID, args.username, numStars)
                );
                break;
        }


    }
});