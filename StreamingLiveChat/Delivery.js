const AWS = require('aws-sdk');
const DB = require('./DB');

class Delivery {
    static sendMessages = async (apiUrl, room, message) => {
        var connectionIds = await DB.getConnectionIds(room);
        var promises = [];

        for (let i = 0; i < connectionIds.length; i++) promises.push(Delivery.sendMessage(apiUrl, connectionIds[i], message));
        await Promise.all(promises);
    }

    static sendMessage = (apiUrl, connectionId, message) => {
        var promise = new Promise(async (resolve, reject) => {

            const apigwManagementApi = new AWS.ApiGatewayManagementApi({ apiVersion: '2020-04-16', endpoint: apiUrl });

            try {
                await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(message) }).promise();
            } catch {
                try {
                    await Delivery.deleteConnection(apiUrl, connectionId)
                } catch (e) {
                    reject(e)
                }
            }
            resolve();
        });
        return promise;
    }

    static deleteConnection = async (apiUrl, connectionId) => {
        var rooms = await DB.loadRooms(connectionId);
        var promises = [];
        for (let i = 0; i < rooms.length; i++) promises.push(Delivery.deleteRoom(apiUrl, rooms[i], connectionId));
        await Promise.all(promises);
    }

    static deleteRoom = (apiUrl, room, connectionId, silent) => {
        const isSilent = silent === true;
        let key = { room: room, connectionId: connectionId };
        return DB.delete("connections", key).then(() => { if (!isSilent) Delivery.sendAttendance(apiUrl, room) });
    }


    static sendAttendance = async (apiUrl, room) => {
        var names = await DB.loadAttendance(room);
        names = names.sort();
        var consolidated = [];
        var lastName = null;
        for (let i = 0; i <= names.length; i++) {
            if (names[i] === lastName) consolidated[consolidated.length - 1].count++;
            else {
                consolidated.push({ displayName: names[i], count: 1 });
                lastName = names[i];
            }
        }
        let message = { action: "updateAttendance", room: room, viewers: consolidated, totalViewers: consolidated.length };
        await Delivery.sendMessages(apiUrl, room, message);
    }

}



module.exports = Delivery;