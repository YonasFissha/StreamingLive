import React from 'react';
import { DisplayBox, TabEdit, TabInterface, ApiHelper, UserHelper } from './';

interface Props { updatedFunction?: () => void }
export const Tabs: React.FC<Props> = (props) => {
    const [tabs, setTabs] = React.useState<TabInterface[]>([]);
    const [currentTab, setCurrentTab] = React.useState<TabInterface>(null);

    const handleUpdated = () => { setCurrentTab(null); loadData(); props.updatedFunction(); }
    const getEditContent = () => { return <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a> }
    const loadData = () => { ApiHelper.apiGet('/tabs').then(data => setTabs(data)); }
    const saveChanges = () => { ApiHelper.apiPost('/tabs', tabs).then(loadData); }

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        var tab: TabInterface = { churchId: UserHelper.currentChurch.id, sort: tabs.length, text: "", url: "", icon: "fas fa-link", tabData: "", tabType: "url" }
        setCurrentTab(tab);
    }

    const makeSortSequential = () => {
        for (let i = 0; i < tabs.length; i++) tabs[i].sort = i + 1;
    }

    const moveUp = (e: React.MouseEvent) => {
        e.preventDefault();
        const idx = parseInt(e.currentTarget.getAttribute("data-idx"));
        makeSortSequential();
        tabs[idx - 1].sort++;
        tabs[idx].sort--;
        saveChanges();
    }

    const moveDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const idx = parseInt(e.currentTarget.getAttribute("data-idx"));
        makeSortSequential();
        tabs[idx].sort++;
        tabs[idx + 1].sort--;
        saveChanges();
    }


    const getRows = () => {
        var idx = 0;
        var rows: JSX.Element[] = [];
        tabs.forEach(tab => {
            const upLink = (idx === 0) ? null : <a href="about:blank" data-idx={idx} onClick={moveUp}><i className="fas fa-arrow-up"></i></a>
            const downLink = (idx === tabs.length - 1) ? null : <a href="about:blank" data-idx={idx} onClick={moveDown}><i className="fas fa-arrow-down"></i></a>
            rows.push(
                <tr>
                    <td><a href={tab.url}><i className={tab.icon} /> {tab.text}</a></td>
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
        <DisplayBox headerIcon="fas fa-folder" headerText="Tabs" editContent={getEditContent()} >
            <table className="table table-sm">
                {getRows()}
            </table>
        </DisplayBox>

    );

}