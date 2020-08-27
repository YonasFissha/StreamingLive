import Cookies from 'js-cookie';
import { ConfigHelper, UserInterface } from '../components';

interface RawChatMessageInterface { action: string, room?: string, userGuid?: string, ts?: number, name?: string, msg?: string, totalViewers?: number, viewers?: ChatViewerInterface[], messages?: RawChatMessageInterface[] }

export interface ChatUserInterface { displayName: string, guid: string, authGuid?: string, isHost: boolean }
export interface ChatStateInterface { rooms: ChatRoomInterface[], callout: string, chatEnabled: boolean, prayerRequests: RawChatMessageInterface[] }
export interface ChatRoomInterface { roomName: string, messages: ChatMessageInterface[], viewers: ChatViewerInterface[] }
export interface ChatMessageInterface { message: string, userGuid: string, timestamp: number, displayName: string }
export interface ChatViewerInterface { displayName: string, count: number }

export class ChatHelper {
    static timerId: any;
    static socket: WebSocket
    static state: ChatStateInterface
    static user: ChatUserInterface
    static prayerGuid: string = ''
    static socketConnected = false;

    static joinRoom(roomName: string) {
        if (ChatHelper.socketConnected) ChatHelper.socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': roomName }));
    }

    static init(keyName: string, messageReceived: (state: ChatStateInterface) => void) {
        ChatHelper.state = { rooms: [], callout: '', chatEnabled: false, prayerRequests: [] };
        ChatHelper.socket = new WebSocket('wss://n0qw9vkmu0.execute-api.us-east-2.amazonaws.com/Prod');
        ChatHelper.socket.onopen = function (e) {
            ChatHelper.socketConnected = true;
            console.log('connected');
            console.log(ChatHelper.state.rooms);
            //ChatHelper.socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': keyName }));
            for (let i = 0; i < ChatHelper.state.rooms.length; i++) ChatHelper.joinRoom(ChatHelper.state.rooms[i].roomName);
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
        ChatHelper.prayerGuid = ChatHelper.user.guid; //ChatHelper.generateGuid();
        var keyName = ConfigHelper.current.keyName;
        ChatHelper.socket.send(JSON.stringify({ 'action': 'requestPrayer', 'room': keyName, 'name': ChatHelper.user.displayName, 'userGuid': ChatHelper.user.guid }));
        //ChatHelper.socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': keyName + ChatHelper.prayerGuid }));
        ChatHelper.getOrCreateRoom(ChatHelper.state, ChatHelper.user.guid);
    }

    static getOrCreateRoom(state: ChatStateInterface | undefined, roomName: string | undefined) {
        if (state === undefined) state = { rooms: [], callout: '', chatEnabled: false, prayerRequests: [] };
        for (let i = 0; i < state.rooms.length; i++) if (state.rooms[i].roomName === roomName) return state.rooms[i];
        var room: ChatRoomInterface = { roomName: roomName || '', messages: [], viewers: [] }
        state.rooms.push(room);
        ChatHelper.joinRoom(room.roomName);
        return room;
    }

    static handleMessage(msg: RawChatMessageInterface) {
        if (msg.action === "updateAttendance") { if (msg.viewers !== undefined) ChatHelper.getOrCreateRoom(ChatHelper.state, msg.room).viewers = msg.viewers; }
        else if (msg.action === "sendMessage") ChatHelper.chatReceived(msg);
        else if (msg.action === "catchup") ChatHelper.catchup(msg);
        else if (msg.action === "setCallout") ChatHelper.state.callout = msg.msg || '';
        else if (msg.action === "deleteMessage") ChatHelper.deleteMessage(msg);

        else if (msg.action === "requestPrayer") {
            ChatHelper.state.prayerRequests.push(msg);
            ConfigHelper.setTabUpdated('prayer');
        }
    }


    static sendMessage(room: string, content: string) {
        var c = content.trim();
        if (c !== '') {
            ChatHelper.socket.send(JSON.stringify({ 'action': 'sendMessage', 'room': room, 'userGuid': ChatHelper.user.guid, 'name': ChatHelper.user.displayName, 'msg': c }));
        }
    }

    static sendDelete(room: string, ts: number) {
        ChatHelper.socket.send(JSON.stringify({ 'action': 'deleteMessage', 'room': room, 'ts': ts }));
    }

    static setCallout(room: string, content: string) {
        ChatHelper.socket.send(JSON.stringify({ 'action': 'setCallout', 'room': room, 'msg': content }));
    }

    static deleteMessage(msg: RawChatMessageInterface) {
        var ts: number = parseFloat(msg.ts?.toString() || '');
        var messages = ChatHelper.getOrCreateRoom(ChatHelper.state, msg.room).messages;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].timestamp === ts) {
                var m = messages.splice(i, 1);
                console.log('removing ');
                console.log(m);
            }
        }
        ChatHelper.getOrCreateRoom(ChatHelper.state, msg.room).messages = messages;
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
        ChatHelper.getOrCreateRoom(ChatHelper.state, msg.room).messages.push(message);
        if (msg.room === ConfigHelper.current.keyName) ConfigHelper.setTabUpdated('chat');
        else if (msg.room === ConfigHelper.current.keyName + 'host') ConfigHelper.setTabUpdated('hostchat');
        else ConfigHelper.setTabUpdated('prayer');
    }

    static keepAlive() {
        var timeout = 60 * 1000;
        if (ChatHelper.socket.readyState === WebSocket.OPEN) ChatHelper.socket.send('{"action":"keepAlive", "room":""}');
        ChatHelper.timerId = setTimeout(ChatHelper.keepAlive, timeout);
    }

    static insertLinks(text: string) {
        //var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
        return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    }

    static getUser() {
        var name = Cookies.get('displayName');
        var guid = Cookies.get('userGuid');
        if (name === undefined || name === null || name === '') { name = 'Anonymous'; Cookies.set('name', name); }
        if (guid === undefined || guid === null || guid === '') { guid = ChatHelper.generateGuid(); Cookies.set('guid', guid); }
        var result: ChatUserInterface = { displayName: name, guid: guid, isHost: false };
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