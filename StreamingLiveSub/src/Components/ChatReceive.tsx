import React from 'react';
import { ChatMessageInterface } from '../Helpers';
import { ChatMessage } from './ChatMessage';

interface Props {

    messages: ChatMessageInterface[]
}

export const ChatReceive: React.FC<Props> = (props) => {
    const getMessages = () => {
        var result = [];
        if (props.messages !== undefined) {
            for (let i = 0; i < props.messages.length; i++) result.push(<ChatMessage key={i} message={props.messages[i]} />);
        }
        setTimeout(() => {
            var cr = document.getElementById('chatReceive');
            if (cr !== null) cr.scrollTo(0, cr.scrollHeight);
        }, 50);
        return result;
    }

    return (
        <div id="chatReceive">{getMessages()}</div>
    );
}




