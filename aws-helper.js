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
        return result.Item.quantity;
    } catch (error) {
        console.error(error);
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
            ExpressionAttributeValues: { ":num": quantity }
        }
        return await docClient.update(params).promise();
    } catch (error) {
        console.error(error);
    }
}

async function setStarCount(username, quantity) {
    try {
        const params = {
            TableName: tableName,
            Item: {
                id: username,
                quantity: quantity
            }
        }
        return await docClient.put(params).promise();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getUserStarCount,
    giveStars,
    setStarCount,
}