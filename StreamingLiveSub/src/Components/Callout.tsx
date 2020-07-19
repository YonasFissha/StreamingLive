import React from 'react';
import { ChatHelper } from '../Helpers';

interface Props {
    callout: string
}

export const Callout: React.FC<Props> = (props) => {
    if (props.callout === '') return null;
    else return (<div id="callout">{ChatHelper.insertLinks(props.callout)}</div>);
}




