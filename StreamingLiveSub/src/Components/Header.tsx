import React from 'react';
import { HeaderButtons, ButtonInterface } from './'

interface Props {
    logoUrl: string,
    homeUrl: string,
    buttons: ButtonInterface[]
}

export const Header: React.FC<Props> = (props) => {
    return (
        <div id="header">
            <div id="logo">
                <a href={props.homeUrl} target="_blank" rel="noopener noreferrer">
                    <img src={"https://streaminglive.church" + props.logoUrl} alt="logo" />
                </a>
            </div>
            <HeaderButtons buttons={props.buttons} />
        </div>
    );
}


