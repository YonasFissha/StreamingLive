const DB = require('./DB');
const Catchup = require('./Catchup');
const Delivery = require('./Delivery');

class Connection {
    static join = async (apiUrl, connectionId, room, data) => {
        let name = data.displayName === undefined ? "Anonymous" : data.displayName;
        await DB.storeConnection(room, connectionId, name);
        await Catchup.sendCatchup(apiUrl, connectionId, room);
        await Delivery.sendAttendance(apiUrl, room);
    }

    static cleanup = async (apiUrl) => {
        var theshold = Date.now();
        theshold.setHours(threshold.getHours() - 6);
        let data = await DB.loadData("connections", "joinTime < :ts", { ":ts": theshold }, "room, connectionId");
        var promises = [];
        for (let i = 0; i < data.Items.length; i++) result.push(Delivery.deleteRoom(apiUrl, data.Items[i].room, data.Items[i].connectionId, true));
        return Promise.all(promises);
    }

    static setNameRoom = async (apiUrl, room, connectionId, name) => {
        let key = { connectionId: connectionId, room: room };
        let expression = "set displayName = :displayName"
        let values = { ":displayName": name };
        return DB.updateData("connections", key, expression, values).then(async () => { await Delivery.sendAttendance(apiUrl, room) });
    }

    static setName = async (apiUrl, connectionId, name) => {
        var rooms = await DB.loadRooms(connectionId);
        var promises = [];
        for (let i = 0; i < rooms.length; i++) promises.push(Connection.setNameRoom(apiUrl, rooms[i], connectionId, name));
        await Promise.all(promises);
    }


}



module.exports = Connection;