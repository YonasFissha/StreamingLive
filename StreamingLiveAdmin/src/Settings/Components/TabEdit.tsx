import React from 'react';
import { InputBox, TabInterface, ApiHelper } from '.'

interface Props { currentTab: TabInterface, updatedFunction?: () => void }

export const TabEdit: React.FC<Props> = (props) => {
    const [currentTab, setCurrentTab] = React.useState<TabInterface>(null);
    const handleDelete = () => { ApiHelper.apiDelete('/tabs/' + currentTab.id).then(() => { setCurrentTab(null); }); props.updatedFunction(); }
    const checkDelete = () => { if (currentTab.id > 0) return handleDelete; else return null; }
    const handleCancel = () => { props.updatedFunction(); }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.currentTarget.value;
        var t = { ...currentTab };
        switch (e.currentTarget.name) {
            case 'text': t.text = val; break;
            case 'type': t.tabType = val; break;
            case 'page': t.tabData = val; break;
            case 'url': t.url = val; break;
        }
        setCurrentTab(t);
    }

    const handleSave = () => {
        ApiHelper.apiPost('/tabs', [currentTab]);
        props.updatedFunction();
    }

    React.useEffect(() => { setCurrentTab(props.currentTab); }, [props.currentTab]);

    return (
        <InputBox headerIcon="fas fa-folder" headerText="Edit Tab" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete} >
            <div className="form-group">
                <label>Text</label>
                <div className="input-group">
                    <input type="text" className="form-control" name="name" value={currentTab.text} onChange={handleChange} />
                    <div className="input-group-append"><button className="btn btn-secondary" role="iconpicker" name="TabIcon" id="TabIcon" data-icon={currentTab.icon} data-iconset="fontawesome5"></button></div>
                </div>
                <input type="hidden" asp-for="TabId" />
            </div>
            <div className="form-group">
                <label>Type</label>
                <select className="form-control" name="type" value={currentTab.tabType} onChange={handleChange}>
                    <option value="url">External Url</option>
                    <option value="page">Page</option>
                    <option value="chat">Chat</option>
                    <option value="prayer">Prayer</option>
                </select>
            </div>
            <div className="form-group">
                <label>Url</label>
                <input type="text" className="form-control" name="url" value={currentTab.url} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Page</label>
                <select className="form-control" name="page" value={currentTab.tabData} onChange={handleChange} ></select>
            </div>
        </InputBox>
    );
}