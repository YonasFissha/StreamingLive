import React from 'react';
import { ChatSend, Callout, Attendance, ChatReceive, ChatStateInterface, ConfigHelper } from './';
import { ServicesHelper, ChatHelper } from '../Helpers';

interface Props {
    chatState: ChatStateInterface | undefined,
    visible: boolean
}

export const Chat: React.FC<Props> = (props) => {

    const [chatEnabled, setChatEnabled] = React.useState(false);

    const updateChatEnabled = React.useCallback(() => {
        var cs = ServicesHelper.currentService;
        var result = false;
        if (cs !== null) {
            var currentTime = new Date();
            result = currentTime >= (cs.localChatStart || new Date()) && currentTime <= (cs.localChatEnd || new Date());
        }
        if (result !== chatEnabled) setChatEnabled(result);
    }, [chatEnabled]);

    React.useEffect(() => { setInterval(updateChatEnabled, 1000); }, [updateChatEnabled]);

    var className = (chatEnabled) ? 'chatContainer' : 'chatContainer chatDisabled';
    return (
        <div className={className} style={(props.visible) ? {} : { display: 'none' }} >
            <Attendance viewers={ChatHelper.getOrCreateRoom(props.chatState, ConfigHelper.current.keyName).viewers} />
            <Callout callout={props.chatState?.callout || ''} roomName={ConfigHelper.current.keyName} />
            <ChatReceive room={ChatHelper.getOrCreateRoom(props.chatState, ConfigHelper.current.keyName) || {}} />
            <ChatSend room={ConfigHelper.current.keyName} />
        </div>
    );
}




