const AWS = require('aws-sdk');

const isOffline = process.env.IS_OFFLINE === 'true';
const dynamoDbOptions = isOffline && { region: 'localhost', endpoint: 'http://localhost:8000' };
const client = new AWS.DynamoDB.DocumentClient(dynamoDbOptions);

class Dynamo {
    static async update(TableName, Key, [attributeName, value]) {
        return await new Promise(resolve => {
            client.update({
                TableName,
                Key,
                UpdateExpression: 'SET #name = :value',
                ExpressionAttributeNames: { '#name': attributeName },
                ExpressionAttributeValues: { ':value': value }
            }, error => {
                if (error) {
                    console.error(error);
                }
                resolve();
            });
        });
    }

    static async put(TableName, Item) {
        return await new Promise(resolve => {
            client.put({ TableName, Item }, (error, data) => {
                if (error) {
                    console.error(error);
                }
                resolve(data);
            });
        });
    }

    static async get(TableName, Key) {
        return await new Promise(resolve => {
            client.get({ TableName, Key }, (error, result) => {
                if (error) {
                    console.error(error); // Could not get message

                    return resolve(null);
                }

                if (!result.Item) {
                    return resolve(null); // Message not found
                }

                resolve(result.Item);
            });
        });
    }
}

Dynamo.tables = {
    MESSAGES: process.env.MESSAGES_TABLE
};

module.exports = Dynamo;
