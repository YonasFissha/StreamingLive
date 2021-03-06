import Cookies from 'js-cookie';
import { ConfigHelper, UserInterface, EnvironmentHelper, ApiHelper } from '../components';

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
        if (ChatHelper.socketConnected) {
            ChatHelper.socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': roomName, 'token': ApiHelper.jwt }));
        }
    }

    static init(messageReceived: (state: ChatStateInterface) => void) {
        ChatHelper.state = { rooms: [], callout: '', chatEnabled: false, prayerRequests: [] };

        if (ChatHelper.socket !== undefined) {
            try {
                ChatHelper.socket.close();
            } catch (e) { console.log(e); }
        }

        ChatHelper.socket = new WebSocket(EnvironmentHelper.ChatApiUrl || "");
        ChatHelper.socket.onopen = function (e) {
            ChatHelper.socketConnected = true;
            for (let i = 0; i < ChatHelper.state.rooms.length; i++) {
                setTimeout(() => {
                    ChatHelper.joinRoom(ChatHelper.state.rooms[i].roomName);
                }, 500);
            }
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
        ChatHelper.socket.send(JSON.stringify({ 'action': 'requestPrayer', 'room': "church_" + ConfigHelper.current.churchId, 'name': ChatHelper.user.displayName, 'userGuid': ChatHelper.user.guid }));
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
            ChatHelper.socket.send(JSON.stringify({ 'action': 'sendMessage', 'room': room, 'userGuid': ChatHelper.user.guid, 'name': ChatHelper.user.displayName, 'msg': c, 'token': ApiHelper.jwt }));
        }
    }

    static sendFacebook(room: string, content: string, name: string) {
        var c = content.trim();
        if (c !== '') {
            ChatHelper.socket.send(JSON.stringify({ 'action': 'sendMessage', 'room': room, 'userGuid': ChatHelper.user.guid, 'name': name, 'msg': c, 'token': ApiHelper.jwt }));
        }
    }

    static sendDelete(room: string, ts: number) {
        ChatHelper.socket.send(JSON.stringify({ 'action': 'deleteMessage', 'room': room, 'ts': ts, 'token': ApiHelper.jwt }));
    }

    static setCallout(room: string, content: string) {
        ChatHelper.socket.send(JSON.stringify({ 'action': 'setCallout', 'room': room, 'msg': content, 'token': ApiHelper.jwt }));
    }

    static deleteMessage(msg: RawChatMessageInterface) {
        var ts: number = parseFloat(msg.ts?.toString() || '');
        var messages = ChatHelper.getOrCreateRoom(ChatHelper.state, msg.room).messages;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].timestamp === ts) {
                var m = messages.splice(i, 1);
            }
        }
        ChatHelper.getOrCreateRoom(ChatHelper.state, msg.room).messages = messages;
    }

    static catchup(msg: RawChatMessageInterface) {
        if (msg.messages !== undefined) {
            for (var i = 0; i < msg.messages.length; i++) {
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
        if (msg.room === "church_" + ConfigHelper.current.churchId) ConfigHelper.setTabUpdated('chat');
        else if (msg.room === "church_" + ConfigHelper.current.churchId + 'host') ConfigHelper.setTabUpdated('hostchat');
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