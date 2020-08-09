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

    if (!edit) return (<a href="#" className="nav-link" onClick={editMode}>Change Name</a>);
    else return (
        <div className="input-group input-group-sm mb-3">
            <input id="nameText" type="text" className="form-control form-control-sm" placeholder="Display name" value={displayName} onChange={handleChange} />
            <div className="input-group-append input-group-append-sm">
                <button id="setNameButton" className="btn btn-primary btn-sm" onClick={handleUpdate}>Update</button>
            </div>
        </div>
    );
}




