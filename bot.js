require('dotenv').config();

const { capitalize, pluralize } = require('./util.js');
const { getUserStarCount, giveStars, setStarCount } = require('./aws-helper.js');
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

bot.on('message', function (user, userID, channelID, message, evt) {

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!loganstars`

    if (message.startsWith("!stars")) {

        logger.info('stars!')

        var args = message.split(" ");
        args.shift();   

        args = parseArgs(args);

        let result;

        switch(args.command) {

            case "give":
                giveStars(args.username, args.quantity).then(
                    result => {
                        bot.sendMessage({
                            to: channelID,
                            message: `gave star`
                        })
                    }
                )
                break;

            case "set":
                setStarCount(args.username, args.quantity).then(
                    result => {
                        bot.sendMessage({
                            to: channelID,
                            message: `${capitalize(args.username)} now has ${args.quantity} ${pluralize("star", args.quantity)}!`
                        })
                    }
                )
                break;

            case "query":
                getUserStarCount(args.username).then(
                    numStars => {
                        bot.sendMessage({
                            to: channelID,
                            message:  `${capitalize(args.username)} has ${numStars} ${pluralize("star", numStars)}!`   
                        })
                    }
                );

                break;
        }


    }
});