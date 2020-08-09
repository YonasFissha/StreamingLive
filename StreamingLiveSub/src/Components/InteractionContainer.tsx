import React from 'react';
import { TabInterface, Chat, HostChat, RequestPrayer, ReceivePrayer } from './';
import { ChatStateInterface, ChatHelper } from '../Helpers';


interface Props {
    tabs: TabInterface[],
    chatState: ChatStateInterface | undefined
}

export const InteractionContainer: React.FC<Props> = (props) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const selectTab = (index: number) => { setSelectedTab(index); }

    const getAltTabs = () => {
        var result = [];
        if (props.tabs != null) {
            for (let i = 0; i < props.tabs.length; i++) {
                let t = props.tabs[i];
                result.push(<td key={i}><a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); selectTab(i); }} className="altTab"><i className={t.icon}></i></a></td>);
            }
        }
        return result;
    }

    const getFlashing = (visible: boolean, t: TabInterface) => {
        var result = false;
        if (!visible) result = t.updated === true;
        else t.updated = false;
        return result;
    }

    const getItems = () => {
        var result = [];
        if (props.tabs != null) {
            for (let i = 0; i < props.tabs.length; i++) {
                let t = props.tabs[i];
                var visible = i === selectedTab;
                var className = getFlashing(visible, t) ? "tab flashing" : "tab";

                result.push(<a key={"anchor" + i.toString()} href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); selectTab(i); }} className={className}>
                    <i className={t.icon}></i>{t.text}
                </a>);

                switch (t.type) {
                    case 'chat':
                        result.push(<Chat key={i} chatState={props.chatState} visible={visible} />);
                        break;
                    case 'hostchat':
                        result.push(<HostChat key={i} chatState={props.chatState} visible={visible} />);
                        break;
                    case 'prayer':
                        if (ChatHelper.user.isHost) result.push(<ReceivePrayer key={i} chatState={props.chatState} visible={visible} />);
                        else result.push(<RequestPrayer key={i} chatState={props.chatState} visible={visible} />);
                        break;
                    default:
                        result.push(<div key={i} id={"frame" + i.toString()} className="frame" style={(!visible) ? { display: 'none' } : {}}><iframe src={t.url} frameBorder="0" title={"frame" + i.toString()}></iframe></div>);
                        break;
                }
            }
        }



        return result;
    }

    return (
        <div id="interactionContainer">
            <table id="altTabs">
                <tbody>
                    <tr>{getAltTabs()}</tr>
                </tbody>
            </table>
            {getItems()}
        </div>
    );
}






