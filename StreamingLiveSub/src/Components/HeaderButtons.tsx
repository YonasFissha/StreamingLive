import React from 'react';
import { ButtonInterface } from './';

interface Props {
    buttons: ButtonInterface[]
}

export const HeaderButtons: React.FC<Props> = (props) => {
    var items = [];
    for (var i = 0; i < props.buttons?.length; i++) {
        var b = props.buttons[i];
        items.push(<td key={i}><a href={b.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{b.text}</a></td>);
    }

    return (
        <div id="liveButtons">
            <div>
                <table>
                    <tbody>
                        <tr>
                            {items}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}




