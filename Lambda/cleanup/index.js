const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2020-04-16'});

exports.handler = async (event) => {
    await cleanCatchup();
    await cleanChat();
    return { statusCode: 200, body: JSON.stringify('Complete') };
};

async function cleanCatchup()
{
    var threshold = Date.now() - (1000 * 60 * 30);
    let connectionData;
    try {
        connectionData = await ddb.scan({ 
            TableName: "catchup",
            ProjectionExpression: "room",
            FilterExpression: "ts < :ts",
            ExpressionAttributeValues: { ":ts": threshold }
        }).promise();
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }
    
    const delCalls = connectionData.Items.map(async ({ room }) => {
        await ddb.delete({ 
            TableName: "catchup", 
            Key: {  "room":  room }
        }).promise();
    });
    
    await Promise.all(delCalls);
}



async function cleanChat()
{
    var threshold = Date.now() - (1000 * 60 * 60 * 12); //12 hours
    let connectionData;
    try {
        connectionData = await ddb.scan({ 
            TableName: "chat",
            ProjectionExpression: "room, connectionId",
            FilterExpression: "joinTime < :ts",
            ExpressionAttributeValues: { ":ts": threshold }
        }).promise();
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }
    
    const delCalls = connectionData.Items.map(async ({ room, connectionId }) => {
        await ddb.delete({ 
            TableName: "chat", 
            Key: {  "room":  room, "connectionId": connectionId }
        }).promise();
    });
    
    await Promise.all(delCalls);
}





