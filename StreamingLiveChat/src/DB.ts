import AWS from 'aws-sdk';
import { UpdateItemInput } from 'aws-sdk/clients/dynamodb';
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

export class DB {
    // *** Catchup
    static deleteCatchup = (room: string) => {
        return DB.delete(process.env.CATCHUP_TABLE, { room });
    }

    static loadCatchup = async (room: string) => {
        const data = await DB.loadData(process.env.CATCHUP_TABLE, "room = :room", { ":room": room }, "messages");
        let messages: any[] = [];
        if (data.Items.length > 0) {
            messages = JSON.parse(data.Items[0].messages);
            const expiration = Date.now() - (1000 * 60 * 15);
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].ts < expiration) messages.splice(i, 1);
            }
        }
        return messages;
    }

    static storeCatchup = async (room: string, msg: string) => {
        const messages = await DB.loadCatchup(room);
        messages.push(msg);
        const record = {
            room,
            ts: parseInt(Date.now().toString(), 0),
            messages: JSON.stringify(messages)
        };
        await DB.storeData(process.env.CATCHUP_TABLE, record);
    }


    // *** Connections
    static loadRooms = async (connectionId: string) => {
        const data = await DB.scan(process.env.CONNECTIONS_TABLE, "connectionId = :connectionId", { ":connectionId": connectionId }, "room");
        const items = data.Items;
        const result: any[] = [];
        items.forEach(item => result.push(item.room));
        return result;
    }

    static storeConnection = async (room: string, connectionId: string, name: string) => {
        const record = {
            room,
            connectionId,
            displayName: name,
            joinTime: Date.now(),
            prettyJoinTime: Date.now().toString()
        };
        await DB.storeData(process.env.CONNECTIONS_TABLE, record);
    }

    static checkStoreConnection = async (room: string, connectionId: string) => {
        const data = await DB.loadData(process.env.CONNECTIONS_TABLE, "room = :room and connectionId = :connectionId", { ":room": room, ":connectionId": connectionId }, "connectionId");
        const result: any[] = [];
        data.Items.forEach(item => { result.push(item.connectionId); });
        return data.Items.length === 0;
    }


    static loadAttendance = async (room: string) => {
        const data = await DB.loadData(process.env.CONNECTIONS_TABLE, "room = :room", { ":room": room }, "displayName");
        const result: any[] = [];
        data.Items.forEach(item => { result.push(item.displayName); });
        return result;
    }

    static getConnectionIds = async (room: string) => {
        const data = await DB.loadData(process.env.CONNECTIONS_TABLE, "room = :room", { ":room": room }, "connectionId");
        const result: any[] = [];
        data.Items.forEach(item => { result.push(item.connectionId); });
        return result;
    }


    // ***Generic
    static scan = async (tableName: string, filter: string, values: any, projection: string) => {
        return ddb.scan({
            TableName: tableName,
            FilterExpression: filter,
            ExpressionAttributeValues: values,
            ProjectionExpression: projection
        }).promise();
    }


    static loadData = async (tableName: string, key: string, values: any, projection: string) => {
        return ddb.query({
            TableName: tableName,
            KeyConditionExpression: key,
            ExpressionAttributeValues: values,
            ProjectionExpression: projection,
            ConsistentRead: true
        }).promise();
    }

    static storeData = async (tableName: string, item: any) => {
        const putParams = {
            TableName: tableName,
            Item: item
        };
        return ddb.put(putParams).promise();
    }

    static updateData = async (tableName: string, key: AWS.DynamoDB.DocumentClient.Key, expression: string, values: any) => {
        const updateParams: UpdateItemInput = {
            TableName: tableName,
            Key: key,
            UpdateExpression: expression,
            ExpressionAttributeValues: values
        };
        return ddb.update(updateParams).promise();
    }

    static delete = async (tableName: string, key: AWS.DynamoDB.DocumentClient.Key) => {
        const delParams: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
            TableName: tableName,
            Key: key
        };
        // throw (JSON.stringify(delParams));
        return ddb.delete(delParams).promise();
    }
}