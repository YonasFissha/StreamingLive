import React from 'react';
import { ChatSend, Attendance, ChatReceive, ChatStateInterface, ConfigHelper } from '.';
import { ChatHelper } from '../helpers';

interface Props {
    chatState: ChatStateInterface | undefined,
    visible: boolean
}


export const HostChat: React.FC<Props> = (props) => {
    return (
        <div className="chatContainer" style={(props.visible) ? {} : { display: 'none' }} >
            <Attendance viewers={ChatHelper.getOrCreateRoom(props.chatState, "church_" + ConfigHelper.current.churchId + '.host').viewers} />
            <ChatReceive room={ChatHelper.getOrCreateRoom(props.chatState, "church_" + ConfigHelper.current.churchId + '.host')} />
            <ChatSend room={"church_" + ConfigHelper.current.churchId + ".host"} />
        </div>
    );
}




