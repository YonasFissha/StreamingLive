
const Connection = require('./Connection');
const Delivery = require('./Delivery');
const Message = require('./Message');

class LambdaEntry {
    static handleMessage = async event => {
        const rc = event.requestContext;
        const eventType = rc.eventType;
        const connectionId = rc.connectionId;
        const apiUrl = rc.domainName + '/' + rc.stage;

        if (eventType == "DISCONNECT") await LambdaEntry.routeChat(apiUrl, connectionId, "disconnect", null, null);
        else {
            const body = JSON.parse(event.body);
            await LambdaEntry.routeChat(apiUrl, connectionId, body.action, body.room, body);
        }
        return { statusCode: 200, body: 'success' }
    }

    static routeChat = async (apiUrl, connectionId, action, room, data) => {
        if (action == "keepAlive") return;
        if (action == "joinRoom") await Connection.join(apiUrl, connectionId, room, data);
        else if (action == "setName") await Connection.setName(apiUrl, connectionId, data.displayName);
        else if (action == "disconnect") await Delivery.deleteConnection(apiUrl, connectionId);
        else if (action == "sendMessage") await Message.send(apiUrl, room, data);
        else if (action == "requestPrayer") await Message.requestPrayer(apiUrl, room, data);
        else if (action == "setCallout") await Message.setCallout(apiUrl, room, data);
        else if (action == "deleteMessage") await Message.delete(apiUrl, room, data);
        else if (action == "updateConfig") await message.updateConfig(apiUrl, room, data);
        else if (action == "cleanup") await LambdaEntry.cleanup();
        else throw (action);
    }

    static cleanup = async (apiUrl) => {
        var promises = [];
        promises.push(Connection.cleanup(apiUrl));
        promises.push(Connection.cleanup());
        await Promise.all(promises);
    }


}

module.exports = LambdaEntry;