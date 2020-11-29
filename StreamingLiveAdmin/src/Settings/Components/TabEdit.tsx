import React from 'react';
import { InputBox, TabInterface, ApiHelper } from '.'
import { PageInterface, UserHelper } from '../../Utils';

interface Props { currentTab: TabInterface, updatedFunction?: () => void }

export const TabEdit: React.FC<Props> = (props) => {
    const [currentTab, setCurrentTab] = React.useState<TabInterface>(null);
    const [pages, setPages] = React.useState<PageInterface[]>(null);
    const checkDelete = () => { if (currentTab?.id > 0) return handleDelete; else return null; }
    const handleCancel = () => { props.updatedFunction(); }
    const loadPages = () => { ApiHelper.apiGet('/pages/').then((data: PageInterface[]) => setPages(data)) }

    const handleDelete = () => {
        if (window.confirm('Are you sure you wish to delete this tab?')) {
            ApiHelper.apiDelete('/tabs/' + currentTab.id).then(() => { setCurrentTab(null); props.updatedFunction(); });
        }
    }

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
        if (currentTab.tabType === "page") currentTab.url = '/data/' + UserHelper.currentChurch.subDomain + '/page' + currentTab.tabData + '.html';
        else if (currentTab.tabType !== "url") currentTab.url = '';
        ApiHelper.apiPost('/tabs', [currentTab]).then(props.updatedFunction);
    }

    const initIcon = (e: React.MouseEvent) => {
        e.preventDefault();
        let target: any = $(e.currentTarget);
        target.iconpicker()
            .on('change', (e: any) => {
                var t = { ...currentTab };
                t.icon = e.icon;
                setCurrentTab(t);
            });
        target.click();
    }

    const getUrl = () => {
        if (currentTab?.tabType === "url") {
            return (
                <div className="form-group">
                    <label>Url</label>
                    <input type="text" className="form-control" name="url" value={currentTab?.url} onChange={handleChange} />
                </div>
            );
        } else return null;
    }

    const getPage = () => {
        if (currentTab?.tabType === "page") {
            let options: JSX.Element[] = [];
            if (pages === null) loadPages();
            else {
                options = [];
                pages.forEach(page => options.push(<option value={page.id} key={page.id}>{page.name}</option>));
            }
            return (
                <div className="form-group">
                    <label>Page</label>
                    <select className="form-control" name="page" value={currentTab?.tabData} onChange={handleChange} >
                        {options}
                    </select>
                </div>
            );
        } else return null;
    }

    React.useEffect(() => { setCurrentTab(props.currentTab); }, [props.currentTab]);

    return (
        <>
            <InputBox headerIcon="fas fa-folder" headerText="Edit Tab" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete()} >
                <div className="form-group">
                    <label>Text</label>
                    <div className="input-group">
                        <input type="text" className="form-control" name="text" value={currentTab?.text} onChange={handleChange} />
                        <div className="input-group-append">
                            <button className="btn btn-secondary iconpicker dropdown-toggle" name="TabIcon" id="TabIcon" data-icon={currentTab?.icon} data-iconset="fontawesome5" onClick={initIcon} >
                                <i className={currentTab?.icon}></i>
                                <span className="caret"></span>
                            </button>
                        </div>
                    </div>
                    <input type="hidden" asp-for="TabId" />
                </div>
                <div className="form-group">
                    <label>Type</label>
                    <select className="form-control" name="type" value={currentTab?.tabType} onChange={handleChange}>
                        <option value="url">External Url</option>
                        <option value="page">Page</option>
                        <option value="chat">Chat</option>
                        <option value="prayer">Prayer</option>
                    </select>
                </div>
                {getUrl()}
                {getPage()}
            </InputBox >
        </>
    );
}