import React from 'react';
import { InputBox, LinkInterface, ApiHelper } from '.'

interface Props { currentLink: LinkInterface, updatedFunction?: () => void }

export const LinkEdit: React.FC<Props> = (props) => {
    const [currentLink, setCurrentLink] = React.useState<LinkInterface>(null);
    const handleDelete = () => { ApiHelper.apiDelete('/links/' + currentLink.id).then(() => { setCurrentLink(null); }); props.updatedFunction(); }
    const checkDelete = () => { if (currentLink.id > 0) return handleDelete; else return null; }
    const handleCancel = () => { props.updatedFunction(); }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        var l = { ...currentLink };
        switch (e.currentTarget.name) {
            case 'text': l.text = val; break;
            case 'url': l.url = val; break;
        }
        setCurrentLink(l);
    }

    const handleSave = () => {
        ApiHelper.apiPost('/links', [currentLink]);
        props.updatedFunction();
    }

    React.useEffect(() => { setCurrentLink(props.currentLink); }, [props.currentLink]);

    return (
        <InputBox headerIcon="fas fa-link" headerText="Edit Link" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete} >
            <div className="form-group">
                <label>Text</label>
                <input type="text" className="form-control" name="text" onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Url</label>
                <input type="text" className="form-control" name="url" onChange={handleChange} />
            </div>
        </InputBox>
    );
}