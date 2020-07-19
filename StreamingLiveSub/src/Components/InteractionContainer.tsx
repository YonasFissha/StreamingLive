import React from 'react';
import { TabInterface, Chat } from './';
import { UserInterface, ChatStateInterface } from '../Helpers';
import { RequestPrayer } from './RequestPrayer';


interface Props {
    user: UserInterface,
    tabs: TabInterface[],
    chatState: ChatStateInterface | undefined
    nameUpdateFunction: (displayName: string) => void
}

export const InteractionContainer: React.FC<Props> = (props) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const getAltTabs = () => {
        var result = [];
        if (props.tabs != null) {
            for (let i = 0; i < props.tabs.length; i++) {
                let t = props.tabs[i];
                result.push(<td key={i}><a href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedTab(i); }} className="altTab"><i className={t.icon}></i></a></td>);
            }
        }
        return result;
    }

    const getItems = () => {
        var result = [];
        if (props.tabs != null) {
            for (let i = 0; i < props.tabs.length; i++) {
                let t = props.tabs[i];
                result.push(<a key={"anchor" + i.toString()} href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedTab(i); }} className="tab"><i className={t.icon}></i>{t.text}</a>);
                if (i === selectedTab) {
                    switch (t.type) {
                        case 'chat':
                            result.push(<Chat key={i} user={props.user} nameUpdateFunction={props.nameUpdateFunction} chatState={props.chatState} />);
                            break;
                        case 'prayer':
                            result.push(<RequestPrayer key={i} user={props.user} nameUpdateFunction={props.nameUpdateFunction} chatState={props.chatState} />);
                            break;
                        default:
                            result.push(<div key={i} id={"frame" + i.toString()} className="frame"><iframe src={t.url} frameBorder="0"></iframe></div>);
                            break;
                    }
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






