import { DB } from './DB';
import { Catchup } from './Catchup';
import { Delivery } from './Delivery';
import { Utils } from './Utils';

export class Connection {
    static join = async (apiUrl: string, connectionId: string, room: string, data: any) => {
        const name = data.displayName === undefined ? "Anonymous" : data.displayName;
        const canJoin = (room.indexOf("_host") === -1) ? true : Utils.isHost(data.token, room);
        if (canJoin) {
            const doStore = await DB.checkStoreConnection(room, connectionId);
            if (doStore) {
                await DB.storeConnection(room, connectionId, name);
                await Catchup.sendCatchup(apiUrl, connectionId, room);
                await Delivery.sendAttendance(apiUrl, room);
            }
        }
    }

    static cleanup = async (apiUrl: string) => {
        const threshold = new Date(Date.now());
        threshold.setHours(threshold.getHours() - 6);
        const data = await DB.loadData(process.env.CONNECTIONS_TABLE, "joinTime < :ts", { ":ts": threshold }, "room, connectionId");
        const promises: Promise<any>[] = [];
        data.Items.forEach(item => promises.push(Delivery.deleteRoom(apiUrl, item.room, item.connectionId, true)));
        return Promise.all(promises);
    }

    static setNameRoom = async (apiUrl: string, room: string, connectionId: string, name: string) => {
        const key: AWS.DynamoDB.DocumentClient.Key = { "room": room, "connectionId": connectionId };
        const expression = "set displayName = :displayName"
        const values = { ":displayName": name };
        return DB.updateData(process.env.CONNECTIONS_TABLE, key, expression, values).then(async () => { await Delivery.sendAttendance(apiUrl, room) });
        // return DB.updateData(process.env.CONNECTIONS_TABLE, key, expression, values);
    }

    static setName = async (apiUrl: string, connectionId: string, name: string) => {
        const rooms = await DB.loadRooms(connectionId);
        const promises: Promise<any>[] = [];
        rooms.forEach(room => { promises.push(Connection.setNameRoom(apiUrl, room, connectionId, name)); });
        await Promise.all(promises);
    }
}