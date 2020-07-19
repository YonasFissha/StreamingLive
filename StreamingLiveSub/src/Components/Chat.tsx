import React from 'react';
import { ChatSend, Callout, Attendance, ChatName, ChatReceive, UserInterface, ChatStateInterface, ConfigHelper } from './';
import { ServicesHelper } from '../Helpers';

interface Props {
    user: UserInterface,
    chatState: ChatStateInterface | undefined
    nameUpdateFunction: (displayName: string) => void,
    visible: boolean
}

export const Chat: React.FC<Props> = (props) => {

    const [chatEnabled, setChatEnabled] = React.useState(false);

    const updateChatEnabled = () => {
        var cs = ServicesHelper.currentService;
        var result = false;
        if (cs !== null) {
            var currentTime = new Date();
            result = currentTime >= (cs.localChatStart || new Date()) && currentTime <= (cs.localChatEnd || new Date);
        }
        if (result != chatEnabled) setChatEnabled(result);
    }

    React.useEffect(() => { setInterval(updateChatEnabled, 1000); }, []);

    var className = (chatEnabled) ? 'chatContainer' : 'chatContainer chatDisabled';
    return (
        <div className={className} style={(props.visible) ? {} : { display: 'none' }} >
            <ChatName user={props.user} updateFunction={props.nameUpdateFunction} />
            <Attendance viewers={props.chatState?.viewers} />
            <Callout callout={props.chatState?.callout || ''} />
            <ChatReceive messages={props.chatState?.messages || []} />
            <ChatSend room={ConfigHelper.current.keyName} />
        </div>
    );
}




