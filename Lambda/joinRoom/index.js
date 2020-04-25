const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2020-04-16' });

exports.handler = async (event) => {
    const putParams = {
        TableName: "chat",
        Item: {
            room: JSON.parse(event.body).room,
            connectionId: event.requestContext.connectionId
        }
    };
    
    try {
        await ddb.put(putParams).promise();
    } catch (err) {
        return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
    }
    
    let connectionData;
    try {
        connectionData = await ddb.query({ TableName: "catchup", KeyConditionExpression: "room = :room", ExpressionAttributeValues: { ":room": JSON.parse(event.body).room}, ProjectionExpression: 'messages', ConsistentRead: true }).promise();
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }
    
    var messages = [];
    if (connectionData.Items.length>0)
    {
        messages = JSON.parse(connectionData.Items[0].messages);
        var fiveMin = Date.now() - (1000 * 60 * 5);
        for (var i=messages.length-1; i>=0; i--)
        {
            if ( parseInt(messages[i].ts) < fiveMin ) {
                messages.splice(i,1);
            }
        }
    }
    
    var responseData = {
        action: "catchup",
        room: JSON.parse(event.body).room,
        messages: messages
    };
    const postData = JSON.stringify(responseData);
    
    
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2020-04-16',
        endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });
    
    try{
        await apigwManagementApi.postToConnection({ ConnectionId: event.requestContext.connectionId, Data: postData }).promise();
    } catch (e) {}
    

    return { statusCode: 200, messages: JSON.stringify(messages) };
};
