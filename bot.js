const { capitalize } = require('./util.js');
const { getUserStarCount, setStarCount } = require('./aws-helper.js');

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) { logger.info('Connected'); });

bot.on('message', function (user, userID, channelID, message, evt) {

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

    if (message.startsWith("!loganstars")) {

        logger.info('stars!')

        var args = message.split(" ");

        username = args[1].toLowerCase();
        command = args[2];

        const params = {
            TableName: 'logan-stars-bot',
            Item: {
                id: username,
                quantity: 1
            }
        }

        let result;

        switch(command) {

            case "give":
                
                result = setStarCount(username, 1);
                if (result.successful) {
                    bot.sendMessage({
                        to: channelID,
                        message: `Gave ${capitalize(username)} one star!`
                    })
                } else {
                    logger.info(result.error);
                    bot.sendMessage({
                        to: channelID,
                        message: `Could not give ${capitalize(username)} a star. Sadge.`
                    });
                }

                break;

            case "query":
                getUserStarCount(username).then(
                    numStars => {
                        bot.sendMessage({
                            to: channelID,
                            message:  `${capitalize(username)} has ${numStars} stars!`   
                        })
                    }
                );


                break;
        }


        // switch(cmd) {

        //     // !ping
        //     case 'ping':
        //         bot.sendMessage({
        //             to: channelID,
        //             message: 'Pong!'
        //         });

        //         docClient.put(params, error => {
        //             if (!error) {
        //                 return message.member.send("successful");
        //             } else {
        //                 throw "Unable to save " + error
        //             }
        //         })

        //     break;

        // }

    }
});