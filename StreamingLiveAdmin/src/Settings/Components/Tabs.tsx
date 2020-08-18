import React from 'react';
import { DisplayBox, TabEdit, TabInterface, ApiHelper } from './';

export const Tabs = () => {
    const [tabs, setTabs] = React.useState<TabInterface[]>([]);
    const [currentTab, setCurrentTab] = React.useState<TabInterface>(null);

    const handleUpdated = () => { setCurrentTab(null); loadData(); }
    const getEditContent = () => { return <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a> }
    const loadData = () => { ApiHelper.apiGet('/tabs').then(data => setTabs(data)); }
    const saveChanges = () => { ApiHelper.apiPost('/tabs', tabs).then(loadData); }

    const handleAdd = () => {
        var link: TabInterface = { churchId: 1, sort: 0, text: "", url: "", icon: "", tabData: "", tabType: "" }
        setCurrentTab(link);
        loadData();
    }

    const moveUp = (idx: number) => {
        tabs[idx - 1].sort++;
        tabs[idx].sort--;
        saveChanges();
    }

    const moveDown = (idx: number) => {
        tabs[idx].sort++;
        tabs[idx + 1].sort--;
        saveChanges();
    }

    const getRows = () => {
        var idx = 0;
        var rows: JSX.Element[] = [];
        tabs.forEach(tab => {
            const upLink = (idx === 0) ? null : <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); moveUp(idx); }}><i className="fas fa-arrow-up"></i></a>
            const downLink = (idx === tabs.length - 1) ? null : <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); moveDown(idx); }}><i className="fas fa-arrow-down"></i></a>
            rows.push(
                <tr>
                    <td><a href={tab.url}>{tab.text}</a></td>
                    <td className="text-right">
                        {upLink}
                        {downLink}
                        <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setCurrentTab(tab); }}><i className="fas fa-pencil-alt"></i></a>
                    </td>
                </tr>
            );
            idx++;
        })
        return rows;
    }

    React.useEffect(() => { loadData(); }, []);

    if (currentTab !== null) return <TabEdit currentTab={currentTab} updatedFunction={handleUpdated} />;
    else return (
        <DisplayBox headerIcon="fas fa-folder" headerText="Tab" editContent={getEditContent()} >
            <table className="table table-sm">
                {getRows()}
            </table>
        </DisplayBox>

    );

}