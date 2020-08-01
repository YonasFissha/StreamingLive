const AWS = require('aws-sdk');
const Connection = require('./Connection');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

class DB {

    //*** Catchup
    static deleteCatchup = (room) => { return DB.delete("catchup", { room: room }); }

    static loadCatchup = async (room) => {
        let data = await DB.loadData("catchup", "room = :room", { ":room": room }, "messages");
        var messages = [];
        if (data.Items.length > 0) {
            messages = JSON.parse(data.Items[0].messages);
            var expiration = Date.now() - (1000 * 60 * 15);
            for (var i = messages.length - 1; i >= 0; i--) if (messages[i].ts < expiration) messages.splice(i, 1);
        }
        return messages;
    }

    static storeCatchup = async (room, msg) => {

        var messages = await this.loadCatchup(room);
        messages.push(msg);
        let record = {
            room: room,
            ts: parseInt(Date.now().toString()),
            messages: JSON.stringify(messages),
        };
        await DB.storeData("catchup", record);
    }

    //*** Connections
    static loadRooms = async (connectionId) => {
        let data = await DB.scan("connections", "connectionId = :connectionId", { ":connectionId": connectionId }, "room");
        var items = data.Items;
        var result = [];
        for (let i = 0; i < items.length; i++) result.push(items[i].room);
        return result;
    }


    static storeConnection = async (room, connectionId, name) => {
        let record = {
            room: room,
            connectionId: connectionId,
            displayName: name,
            joinTime: Date.now(),
            prettyJoinTime: Date.now().toString()
        };
        await DB.storeData("connections", record);
    }


    static loadAttendance = async (room) => {
        let data = await DB.loadData("connections", "room = :room", { ":room": room }, "displayName");
        var result = [];
        for (let i = 0; i < data.Items.length; i++) result.push(data.Items[i].displayName);
        return result;
    }

    static getConnectionIds = async (room) => {
        let data = await DB.loadData("connections", "room = :room", { ":room": room }, "connectionId");
        var result = [];
        for (let i = 0; i < data.Items.length; i++) result.push(data.Items[i].connectionId);
        return result;
    }


    //***Generic
    static scan = async (tableName, filter, values, projection) => {
        return ddb.scan({
            TableName: tableName,
            FilterExpression: filter,
            ExpressionAttributeValues: values,
            ProjectionExpression: projection
        }).promise();
    }


    static loadData = async (tableName, key, values, projection) => {
        return ddb.query({
            TableName: tableName,
            KeyConditionExpression: key,
            ExpressionAttributeValues: values,
            ProjectionExpression: projection,
            ConsistentRead: true
        }).promise();
    }

    static storeData = async (tableName, item) => {
        const putParams = {
            TableName: tableName,
            Item: item
        };
        return ddb.put(putParams).promise();
    }

    static updateData = async (tableName, key, expression, values) => {
        const updateParams = {
            TableName: tableName,
            Key: key,
            UpdateExpression: expression,
            ExpressionAttributeValues: values
        };
        return ddb.update(updateParams).promise();
    }

    static delete = async (tableName, key) => {
        const delParams = {
            TableName: tableName,
            Key: key
        };
        return ddb.delete(delParams).promise();
    }

}



module.exports = DB;