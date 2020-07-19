import React from 'react';
import { ChatMessageInterface, ChatHelper } from '../Helpers';

interface Props { message: ChatMessageInterface }

export const ChatMessage: React.FC<Props> = (props) => {
    return (
        <div className="message">
            <b>{props.message.displayName}:</b> <span dangerouslySetInnerHTML={{ __html: ChatHelper.insertLinks(props.message.message) }}></span>
        </div >
    );
}




