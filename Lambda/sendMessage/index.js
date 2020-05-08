const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2020-04-16' });

const lambda = new AWS.Lambda({ region: "us-east-2" });

function replaceBadWords(message) {
    //I wish there was a better way than having to list all of these.
    var badWords = /\b(anal|ass|asses|ballsack|boner|clit|clitoris|cum|cunt|cunts|dicks|fag|fags|homo|homos|jiz|tit|twat|wang)\b|\b(cock|sex)|asshole|bastard|bitch|biatch|blowjob|boob|bollock|bollok|butthole|dickhead|damn|dildo|duche|dyke|ejaculate|faggot|fellatio|fuck|masterbat|nigger|nigga|nutsack|orgasm|pecker|penis|pimp|piss|pussy|pussies|schlong|screw|shit|slut|testicle|tits|titt|viagra|vulva|wanker|whore/gi;
    return message.replace(badWords, '****');
}

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
    responseData.ts = Date.now().toString();
    responseData.message = replaceBadWords(responseData.message);
    const postData = JSON.stringify(responseData);

    const postCalls = connectionData.Items.map(async ({ connectionId }) => {
        try {
            await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();
        } catch (e) {
            await ddb.delete({
                TableName: "connections",
                Key: { "room": room, "connectionId": connectionId }
            }).promise();
        }
    });

    try {
        await Promise.all(postCalls);
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }

    var payload = { "action": "storeCatchup", "room": room, "originalMessage": responseData };
    const params = { FunctionName: "storeCatchup", InvokeArgs: JSON.stringify(payload) };
    await lambda.invokeAsync(params, function (err, data) { }).promise();



    return { statusCode: 200, body: 'Data sent.' };
};