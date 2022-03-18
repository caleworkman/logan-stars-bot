require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Create the service used to connect to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'logan-stars-bot';

async function getUserStarCount(username) {
    try {
        const params = {
            TableName: tableName,
            Key: { id: username }
        }

        var result = await docClient.get(params).promise();

        if (Object.keys(result).length === 0) {
            // Username does not exist in DB
            return setStarCount(username, 0);
        }

        return result.Item.quantity;
    } catch (error) {
        return handleError(error, username, 0);
    }
}

async function giveStars(username, quantityString) {
    try {
        const quantity = parseInt(quantityString);
        const params = {
            TableName: tableName,
            Key: { id: username },
            UpdateExpression: "SET quantity = quantity + :num",
            ConditionExpression: "attribute_exists(quantity)",
            ExpressionAttributeValues: { ":num": quantity },
            ReturnValues: "ALL_NEW"
        }
        const result = await docClient.update(params).promise();
        return result.Attributes.quantity;
    } catch (error) {
        return handleError(error, username, parseInt(quantityString));
    }
}

async function setStarCount(username, quantityString) {
    try {
        const quantity = parseInt(quantityString);
        const params = {
            TableName: tableName,
            Item: {
                id: username,
                quantity: quantity
            }
        }
        await docClient.put(params).promise();
        return quantity;
    } catch (error) {
        return handleError(error, username, parseInt(quantityString));
    }
}

async function takeStars(username, quantityString) {
    try {
        if (quantityString === "all") {
            return await setStarCount(username, 0);
        }

        const quantity = parseInt(quantityString);
        const params = {
            TableName: tableName,
            Key: { id: username },
            UpdateExpression: "SET quantity = quantity - :num",
            ConditionExpression: "attribute_exists(quantity) AND quantity > :min",
            ExpressionAttributeValues: { 
                ":min": 0,
                ":num": quantity 
            },
            ReturnValues: "ALL_NEW"
        }

        const result = await docClient.update(params).promise();
        return result.Attributes.quantity;
    } catch (error) {
        return handleError(error, username, 0);
    }
}

function handleError(error, username, quantity) {
    if (error.code === "ConditionalCheckFailedException") {
        // assume the username doesn't exist in the database
        return setStarCount(username, quantity);
    } else {
        console.error(error)
    }
}

module.exports = {
    getUserStarCount,
    giveStars,
    setStarCount,
    takeStars
}