import React, { KeyboardEvent } from 'react';
import { ChatHelper } from '../helpers';
import { Emojis } from './Emojis';

interface Props {
    room: string
}

export const ChatSend: React.FC<Props> = (props) => {
    const [message, setMessage] = React.useState('');
    const [showEmojis, setShowEmojis] = React.useState(false);

    const handleSendMessage = (e: React.MouseEvent) => {
        e.preventDefault();
        sendMessage();
    }

    const sendMessage = () => {
        ChatHelper.sendMessage(props.room, message);
        setMessage('');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setMessage(e.currentTarget.value); }
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => { if (e.keyCode === 13) sendMessage(); }
    const toggleEmojis = (e: React.MouseEvent) => { e.preventDefault(); setShowEmojis(!showEmojis); }
    const insertEmoji = (emoji: string) => { setMessage(message + emoji); }

    var emojiContent = (showEmojis) ? <Emojis selectedFunction={insertEmoji} /> : null;

    return (
        <div id="chatSend">
            {emojiContent}
            <div className="input-group" id="sendPublic">
                <div className="input-group-prepend">
                    <a href="about:blank" onClick={toggleEmojis} data-field="sendText" className="btn btn-outline-secondary emojiButton"><span role="img" aria-label="emoji">😀</span></a>
                </div>
                <input type="text" className="form-control" id="sendText" value={message} onChange={handleChange} onKeyDown={handleKeyDown} />
                <div className="input-group-append">
                    <a id="sendMessageButton" className="btn btn-primary" href="about:blank" onClick={handleSendMessage}>Send</a>
                </div>
            </div>
        </div>
    );
}




