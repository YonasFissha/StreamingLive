import React from 'react';
import { ChatStateInterface, ChatSend, ConfigHelper } from './';
import { ChatHelper } from '../Helpers';
import { ChatReceive } from './ChatReceive';


interface Props {
    chatState: ChatStateInterface | undefined
    visible: boolean
}

export const RequestPrayer: React.FC<Props> = (props) => {
    const [prayerGuid, setPrayerGuid] = React.useState('');

    const requestPrayer = (e: React.MouseEvent) => {
        e.preventDefault();
        ChatHelper.requestPrayer();
        setPrayerGuid(ChatHelper.prayerGuid);
    }


    if (prayerGuid !== '') return (<div className="chatContainer" style={(props.visible) ? {} : { display: 'none' }}>
        <ChatReceive room={ChatHelper.getOrCreateRoom(props.chatState, ConfigHelper.current.keyName + prayerGuid)} />
        <ChatSend room={ConfigHelper.current.keyName + prayerGuid} />
    </div>)

    else return (<div id="prayerContainer" style={(props.visible) ? {} : { display: 'none' }}>
        Need prayer?  Start a private chat session with one of our hosts.
        <button id="requestPrayerButton" className="btn btn-primary btn-block" onClick={requestPrayer}>Request Prayer</button>
    </div>);

}





