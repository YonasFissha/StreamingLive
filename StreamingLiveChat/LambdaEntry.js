
const { Connection } = require('./dist/Connection');
const { Delivery } = require('./dist/Delivery');
const { Message } = require('./dist/Message');
const dotenv = require('dotenv');


module.exports.handleMessage = async function handleMessage(event) {
    const rc = event.requestContext;
    const eventType = rc.eventType;
    const connectionId = rc.connectionId;
    const apiUrl = rc.domainName + '/' + rc.stage;

    if (eventType == "DISCONNECT") await LambdaEntry.routeChat(apiUrl, connectionId, "disconnect", null, null);
    else {
        const body = JSON.parse(event.body);
        await routeChat(apiUrl, connectionId, body.action, body.room, body);
    }
    return { statusCode: 200, body: 'success' }
}

async function routeChat(apiUrl, connectionId, action, room, data) {
    if (action == "keepAlive") return;
    if (action == "joinRoom") await Connection.join(apiUrl, connectionId, room, data);
    else if (action == "setName") await Connection.setName(apiUrl, connectionId, data.displayName);
    else if (action == "disconnect") await Delivery.deleteConnection(apiUrl, connectionId);
    else if (action == "sendMessage") await Message.send(apiUrl, room, data);
    else if (action == "requestPrayer") await Message.requestPrayer(apiUrl, room, data);
    else if (action == "setCallout") await Message.setCallout(apiUrl, room, data);
    else if (action == "deleteMessage") await Message.delete(apiUrl, room, data);
    else if (action == "updateConfig") await message.updateConfig(apiUrl, room, data);
    else if (action == "cleanup") await cleanup();
    else throw (action);
}

async function cleanup(apiUrl) {
    var promises = [];
    promises.push(Connection.cleanup(apiUrl));
    promises.push(Connection.cleanup());
    await Promise.all(promises);
}
