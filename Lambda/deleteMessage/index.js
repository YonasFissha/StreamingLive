const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2020-04-16' });

exports.handler = async event => {
    let connectionData;
    const room = JSON.parse(event.body).room;

    try {
        connectionData = await ddb.query({ TableName: "connections", KeyConditionExpression: "room = :room", ExpressionAttributeValues: { ":room": room }, ProjectionExpression: 'connectionId' }).promise();
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2020-04-16',
        endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });

    var responseData = JSON.parse(event.body);
    //responseData.ts = Date.now().toString();
    const postData = JSON.stringify(responseData);
    //const postData = event.body;

    const postCalls = connectionData.Items.map(async ({ connectionId }) => {
        try {
            await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();
        } catch (e) {
            //if (e.statusCode === 410) {
            await ddb.delete({
                TableName: "connections",
                Key: { "room": room, "connectionId": connectionId }
            }).promise();
            //}
        }
    });

    try {
        await Promise.all(postCalls);
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }

    return { statusCode: 200, body: 'Data sent.' };
};