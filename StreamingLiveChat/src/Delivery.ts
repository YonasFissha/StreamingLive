import { ApiGatewayManagementApi } from 'aws-sdk';
import { DB } from './DB';
import { bool } from 'aws-sdk/clients/signer';

export class Delivery {
    static sendMessages = async (apiUrl: string, room: string, message: any) => {
        const connectionIds = await DB.getConnectionIds(room);
        const promises: Promise<any>[] = [];
        connectionIds.forEach(id => { promises.push(Delivery.sendMessage(apiUrl, id, message)); });
        await Promise.all(promises);
    }

    static sendMessage = (apiUrl: string, connectionId: string, message: any) => {
        const promise = new Promise(async (resolve, reject) => {
            const apigwManagementApi = new ApiGatewayManagementApi({ apiVersion: '2020-04-16', endpoint: apiUrl });
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

    static deleteConnection = async (apiUrl: string, connectionId: string) => {
        const rooms = await DB.loadRooms(connectionId);
        const promises: Promise<any>[] = [];
        rooms.forEach(room => { promises.push(Delivery.deleteRoom(apiUrl, room, connectionId, false)); });
        await Promise.all(promises);
    }

    static deleteRoom = async (apiUrl: string, room: string, connectionId: string, silent: boolean) => {
        const key: AWS.DynamoDB.DocumentClient.Key = { "room": room, "connectionId": connectionId };
        await DB.delete(process.env.CONNECTIONS_TABLE, key);
        if (!silent) Delivery.sendAttendance(apiUrl, room);
    }

    static sendAttendance = async (apiUrl: string, room: string) => {
        let names = await DB.loadAttendance(room);
        names = names.sort();
        const consolidated = [];
        let lastName = null;
        for (let i = 0; i <= names.length; i++) {
            if (names[i] === lastName) consolidated[consolidated.length - 1].count++;
            else {
                consolidated.push({ displayName: names[i], count: 1 });
                lastName = names[i];
            }
        }
        const message = { action: "updateAttendance", room, viewers: consolidated, totalViewers: consolidated.length };
        await Delivery.sendMessages(apiUrl, room, message);
    }

}