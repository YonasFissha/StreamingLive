const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2020-04-16' });
const lambda = new AWS.Lambda({ region: "us-east-2" });

exports.handler = async (data) => {
    let connectionData;
    const room = data.room;

    try {
        connectionData = await ddb.query({ TableName: "catchup", KeyConditionExpression: "room = :room", ExpressionAttributeValues: { ":room": room }, ProjectionExpression: 'messages' }).promise();
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }

    var messages = [];
    var isNew = true;

    if (connectionData.Items.length > 0) {
        isNew = false;
        messages = JSON.parse(connectionData.Items[0].messages);
    }

    if (messages.length > 0) {

        for (var i = messages.length - 1; i >= 0; i--) {
            if (messages[i].ts == data.ts) messages.splice(i, 1);
        }


        const putParams = {
            TableName: "catchup",
            Item: { room: data.room, ts: parseInt(Date.now().toString()), messages: JSON.stringify(messages) }
        };
        try {
            if (isNew) await ddb.put(putParams).promise();
            else {
                const updateParams = {
                    TableName: "catchup",
                    Key: { "room": data.room },
                    UpdateExpression: "set messages = :messages, ts = :ts",
                    ExpressionAttributeValues: { ":messages": JSON.stringify(messages), ":ts": parseInt(Date.now().toString()) }
                }
                await ddb.update(updateParams).promise();
            }
        } catch (err) {
            return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
        }
    }
};
