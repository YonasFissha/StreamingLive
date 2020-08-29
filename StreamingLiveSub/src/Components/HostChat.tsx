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
            <Attendance viewers={ChatHelper.getOrCreateRoom(props.chatState, ConfigHelper.current.churchId + '.host').viewers} />
            <ChatReceive room={ChatHelper.getOrCreateRoom(props.chatState, ConfigHelper.current.churchId + '.host')} />
            <ChatSend room={ConfigHelper.current.churchId + ".host"} />
        </div>
    );
}




