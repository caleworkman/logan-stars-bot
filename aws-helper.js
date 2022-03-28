require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Create the service used to connect to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = (process.env.NODE_ENV == "prod") ? "logan-stars-bot" : "discord-stars-dev";

async function getLeaderboard(numString, isLoserboard=False) {
    try {
        const params = {
            TableName: tableName,
        }

        var result = await docClient.scan(params).promise();
        const users = result.Items;
        users.sort((a, b) => {
            if (isLoserboard) return a.quantity - b.quantity;
            return b.quantity - a.quantity
        });

        const numUsers = (numString === "all") ? users.length : parseInt(numString);
        return users.slice(0, numUsers);;
    } catch (error) {
        console.log(error);
    }
}

async function getUserStarCount(user, guildId) {
    try {
        const params = {
            TableName: tableName,
            Key: { 
                id: user.id, 
                guildId: guildId
            },
        }

        var result = await docClient.get(params).promise();

        if (Object.keys(result).length === 0) {
            // User does not exist in DB
            return setStarCount(user, guildId, 3);
        }

        return result.Item.quantity;
    } catch (error) {
        return error;
    }
}

async function giveStars(user, guildId, numStars) {
    try {
        const params = {
            TableName: tableName,
            Key: { 
                id: user.id, 
                guildId: guildId,
            },
            UpdateExpression: "SET quantity = quantity + :num, username = :username",
            ConditionExpression: "attribute_exists(quantity)",
            ExpressionAttributeValues: { 
                ":num": numStars,
                ":username": user.username,
            },
            ReturnValues: "ALL_NEW"
        }
        const result = await docClient.update(params).promise();
        return result.Attributes.quantity;
    } catch (error) {
        return handleError(error, user, guildId, numStars);
    }
}

async function setStarCount(user, guildId, numStars=3) {
    try {
        const params = {
            TableName: tableName,
            Item: {
                id: user.id,
                guildId: guildId,
                username: user.username, 
                quantity: numStars
            }
        }
        await docClient.put(params).promise();
        return numStars;
    } catch (error) {
        console.log(error);
    }
}

async function takeStars(user, guildId, numStars) {
    try {
        const params = {
            TableName: tableName,
            Key: { 
                id: user.id, 
                guildId: guildId,
            },
            UpdateExpression: "SET quantity = quantity - :num, username = :username",
            ConditionExpression: "attribute_exists(quantity) AND quantity > :min",
            ExpressionAttributeValues: { 
                ":min": numStars,
                ":num": numStars,
                ":username": user.username
            },
            ReturnValues: "ALL_NEW"
        }

        const result = await docClient.update(params).promise();
        return result.Attributes.quantity;
    } catch (error) {
        // Also sets to 0 if condition expression is invalid (trying to take too many)
        return handleError(error, user, guildId, 0);
    }
}

function handleError(error, user, guildId, quantity) {
    if (error.code === "ConditionalCheckFailedException") {
        // assume the user doesn't exist in the database
        return setStarCount(user, guildId, quantity);
    } else {
        console.error(error)
    }
}

module.exports = {
    getLeaderboard,
    getUserStarCount,
    giveStars,
    setStarCount,
    takeStars
}