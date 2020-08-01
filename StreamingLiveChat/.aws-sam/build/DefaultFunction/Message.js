const Utils = require('./Utils');
const Delivery = require('./Delivery');
const DB = require('./DB');

class Message {

    static send = async (apiUrl, room, message) => {
        message.msg = Utils.replaceBadWords(message.msg);
        message.ts = parseInt(Date.now().toString());
        await Delivery.sendMessages(apiUrl, room, message);
        await DB.storeCatchup(room, message);
    }

    static requestPrayer = async (apiUrl, room, message) => {
        message.ts = parseInt(Date.now().toString());
        await Delivery.sendMessages(apiUrl, room + '.host', message);
        await DB.storeCatchup(room + '.host', message);
    }

    static setCallout = async (apiUrl, room, message) => {
        message.ts = parseInt(Date.now().toString());
        await Delivery.sendMessages(apiUrl, room, message);
        await DB.storeCatchup(room, message);
    }

    static delete = async (apiUrl, room, message) => {
        await Delivery.sendMessages(apiUrl, room, message);
        await DB.storeCatchup(room, message);
    }

    static updateConfig = async (apiUrl, room, message) => { Delivery.sendMessages(apiUrl, room, message); }

}



module.exports = Message;