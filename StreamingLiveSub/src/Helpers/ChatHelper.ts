import Cookies from 'js-cookie';
import { ConfigHelper, ServicesHelper } from '../Components';

interface RawChatMessageInterface { action: string, room?: string, userGuid?: string, ts?: number, name?: string, msg?: string, totalViewers?: number, viewers?: ChatViewerInterface[], messages?: RawChatMessageInterface[] }

export interface UserInterface { displayName: string, guid: string }
export interface ChatStateInterface { messages: ChatMessageInterface[], viewers: ChatViewerInterface[], callout: string, prayerMessages: ChatMessageInterface[], chatEnabled: boolean }
export interface ChatMessageInterface { message: string, userGuid: string, timestamp: number, displayName: string }
export interface ChatViewerInterface { displayName: string, count: number }

export class ChatHelper {
    static timerId: any;
    static socket: WebSocket
    static state: ChatStateInterface
    static user: UserInterface
    static prayerGuid: string = ''

    static init(keyName: string, messageReceived: (state: ChatStateInterface) => void) {
        ChatHelper.state = { messages: [], viewers: [], callout: '', prayerMessages: [], chatEnabled: false };
        ChatHelper.socket = new WebSocket('wss://n0qw9vkmu0.execute-api.us-east-2.amazonaws.com/Prod');
        ChatHelper.socket.onopen = function (e) {
            ChatHelper.socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': keyName }));
            if (ChatHelper.user.displayName !== 'Anonymous') ChatHelper.setName(ChatHelper.user.displayName);
            setTimeout(ChatHelper.keepAlive, 30 * 1000);
        };

        ChatHelper.socket.onmessage = function (event) {
            ChatHelper.handleMessage(JSON.parse(event.data));
            messageReceived({ ...ChatHelper.state });
        };
    }

    static setName(name: string) {
        ChatHelper.user.displayName = name;
        Cookies.set('displayName', name);
        ChatHelper.socket.send(JSON.stringify({ 'action': 'setName', 'userGuid': ChatHelper.user.guid, 'displayName': name }));
    }

    static requestPrayer() {
        ChatHelper.prayerGuid = ChatHelper.generateGuid();
        var keyName = ConfigHelper.current.keyName;
        ChatHelper.socket.send(JSON.stringify({ 'action': 'requestPrayer', 'room': keyName, 'name': ChatHelper.user.displayName, 'guid': ChatHelper.prayerGuid }));
        ChatHelper.socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': keyName + ChatHelper.prayerGuid }));
    }

    static handleMessage(msg: RawChatMessageInterface) {
        console.log('received message');
        console.log(msg);
        if (msg.action === "updateAttendance") { if (msg.viewers !== undefined) ChatHelper.state.viewers = msg.viewers; }
        else if (msg.action === "sendMessage") ChatHelper.chatReceived(msg);
        else if (msg.action === "catchup") ChatHelper.catchup(msg);
        else if (msg.action === "setCallout") ChatHelper.state.callout = msg.msg || '';
        else if (msg.action === "deleteMessage") ChatHelper.deleteMessage(msg);
        //console.log(ChatHelper.state);
        /*
        else if (msg.action == "updateConfig") updateConfig();
        */
    }


    static sendMessage(room: string, content: string) {
        var c = content.trim();
        if (c != '') {
            ChatHelper.socket.send(JSON.stringify({ 'action': 'sendMessage', 'room': room, 'userGuid': ChatHelper.user.guid, 'name': ChatHelper.user.displayName, 'msg': c }));
        }
    }

    static deleteMessage(msg: RawChatMessageInterface) {
        var ts: number = parseFloat(msg.ts?.toString() || '');
        var messages = ChatHelper.state.messages;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].timestamp === ts) {
                var m = messages.splice(i, 1);
                console.log('removing ');
                console.log(m);
            }
        }
        ChatHelper.state.messages = messages;
    }

    static catchup(msg: RawChatMessageInterface) {
        console.log('catchup received');
        console.log(msg);
        if (msg.messages !== undefined) {
            for (var i = 0; i < msg.messages.length; i++) {
                console.log('catchup');
                console.log(msg.messages[i]);
                ChatHelper.handleMessage(msg.messages[i]);
            }
        }
    }

    static chatReceived(msg: RawChatMessageInterface) {
        var message = {
            userGuid: msg.userGuid || '',
            displayName: msg.name || 'Anonymous',
            message: msg.msg || '',
            timestamp: msg.ts || 0
        };
        if (msg.room === ConfigHelper.current.keyName) ChatHelper.state.messages.push(message);
        else ChatHelper.state.prayerMessages.push(message);
    }

    static keepAlive() {
        var timeout = 60 * 1000;
        console.log(ChatHelper.socket.readyState == WebSocket.OPEN);
        if (ChatHelper.socket.readyState == WebSocket.OPEN) ChatHelper.socket.send('{"action":"keepAlive", "room":""}');
        ChatHelper.timerId = setTimeout(ChatHelper.keepAlive, timeout);
    }

    static insertLinks(text: string) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    }

    static getUser() {
        var name = Cookies.get('displayName');
        var guid = Cookies.get('userGuid');
        if (name === undefined || name === null || name === '') { name = 'Anonymous'; Cookies.set('name', name); }
        if (guid === undefined || guid === null || guid === '') { guid = ChatHelper.generateGuid(); Cookies.set('guid', guid); }
        var result: UserInterface = { displayName: name, guid: guid };
        ChatHelper.user = result;
        return result;
    }


    static S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    static generateGuid() {
        return (ChatHelper.S4() + ChatHelper.S4() + "-" + ChatHelper.S4() + "-4" + ChatHelper.S4().substr(0, 3) + "-" + ChatHelper.S4() + "-" + ChatHelper.S4() + ChatHelper.S4() + ChatHelper.S4()).toLowerCase();;
    }
}