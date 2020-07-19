import React from 'react';
import { ButtonInterface } from './';
import { UserInterface } from '../Helpers';

interface Props {
    user: UserInterface,
    updateFunction: (displayName: string) => void
}

export const ChatName: React.FC<Props> = (props) => {
    const [edit, setEdit] = React.useState(false);
    const [displayName, setDisplayName] = React.useState('');

    const editMode = (e: React.MouseEvent) => {
        e.preventDefault();
        setEdit(true);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(e.currentTarget.value);
    }

    const handleUpdate = (e: React.MouseEvent) => {
        e.preventDefault();
        if (displayName === '') alert('Please enter a name');
        else {
            props.updateFunction(displayName);
            setEdit(false);
        }
    }

    if (!edit) return (<div id="nameBar">Chatting as: <a id="nameLink" href="about:blank" onClick={editMode}>{props.user?.displayName}</a></div>);
    else return (<div id="nameBar">
        <div className="input-group mb-3">
            <input id="nameText" type="text" className="form-control" placeholder="Display name" value={displayName} onChange={handleChange} />
            <div className="input-group-append">
                <button id="setNameButton" className="btn btn-primary" onClick={handleUpdate}>Update</button>
            </div>
        </div>
    </div>);
}




