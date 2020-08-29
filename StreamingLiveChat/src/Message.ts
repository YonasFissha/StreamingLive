import { Utils } from './Utils';
import { Delivery } from './Delivery';
import { DB } from './DB';

export class Message {

    static send = async (apiUrl: string, room: string, message: any) => {
        const canSend = (room.indexOf("_host") === -1) ? true : Utils.isHost(message.token, room);
        if (canSend) {
            message.msg = Utils.replaceBadWords(message.msg);
            message.token = null;
            message.ts = parseInt(Date.now().toString(), 0);
            await Delivery.sendMessages(apiUrl, room, message);
            await DB.storeCatchup(room, message);
        }
    }

    static requestPrayer = async (apiUrl: string, room: string, message: any) => {
        message.token = null;
        message.ts = parseInt(Date.now().toString(), 0);
        await Delivery.sendMessages(apiUrl, room + '.host', message);
        await DB.storeCatchup(room + '.host', message);
    }

    static setCallout = async (apiUrl: string, room: string, message: any) => {
        if (Utils.isHost(message.token, room)) {
            message.token = null;
            message.ts = parseInt(Date.now().toString(), 0);
            await Delivery.sendMessages(apiUrl, room, message);
            await DB.storeCatchup(room, message);
        }
    }

    static delete = async (apiUrl: string, room: string, message: any) => {
        if (Utils.isHost(message.token, room)) {
            message.token = null;
            await Delivery.sendMessages(apiUrl, room, message);
            await DB.storeCatchup(room, message);
        }
    }

    static updateConfig = async (apiUrl: string, room: string, message: any) => { Delivery.sendMessages(apiUrl, room, message); }
}