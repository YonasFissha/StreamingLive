import { Utils } from './Utils';
import { Delivery } from './Delivery';
import { DB } from './DB';

export class Message {

    static send = async (apiUrl: string, room: string, message: any) => {
        message.msg = Utils.replaceBadWords(message.msg);
        message.ts = parseInt(Date.now().toString(), 0);
        await Delivery.sendMessages(apiUrl, room, message);
        await DB.storeCatchup(room, message);
    }

    static requestPrayer = async (apiUrl: string, room: string, message: any) => {
        message.ts = parseInt(Date.now().toString(), 0);
        await Delivery.sendMessages(apiUrl, room + '.host', message);
        await DB.storeCatchup(room + '.host', message);
    }

    static setCallout = async (apiUrl: string, room: string, message: any) => {
        message.ts = parseInt(Date.now().toString(), 0);
        await Delivery.sendMessages(apiUrl, room, message);
        await DB.storeCatchup(room, message);
    }

    static delete = async (apiUrl: string, room: string, message: any) => {
        await Delivery.sendMessages(apiUrl, room, message);
        await DB.storeCatchup(room, message);
    }

    static updateConfig = async (apiUrl: string, room: string, message: any) => { Delivery.sendMessages(apiUrl, room, message); }
}