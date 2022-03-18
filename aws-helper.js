require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Create the service used to connect to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: 'logan-stars-bot',
}

async function getUserStarCount(username) {
    try {
        params['Key'] = {
            'id': username
        }
        var result = await docClient.get(params).promise()
        console.log(JSON.stringify(result))
        return result.Item.quantity;
    } catch (error) {
        console.error(error);
    }
}

function setStarCount(username, quantity) {

    params['Item'] = {
        id: username,
        quantity: quantity
    }

    return docClient.put(params, error => {
        if (!error) return { successful: true }
        else return { successful: false, error: error }
    });
}

module.exports = {
    getUserStarCount,
    setStarCount,
}