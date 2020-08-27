import React from 'react';
import { ButtonInterface } from '.';

interface Props {
    buttons: ButtonInterface[]
}

export const NavItems: React.FC<Props> = (props) => {
    var items = [];
    for (var i = 0; i < props.buttons?.length; i++) {
        var b = props.buttons[i];
        items.push(<li key={i} className="nav-item" ><a href={b.url} target="_blank" rel="noopener noreferrer" className="nav-link">{b.text}</a></li>);
    }

    return (
        <>
            {items}
        </>
    );
}




