import React from 'react';
import { DisplayBox, LinkInterface, LinkEdit, ApiHelper } from '.'

export const Links = () => {
    const [links, setLinks] = React.useState<LinkInterface[]>([]);
    const [currentLink, setCurrentLink] = React.useState<LinkInterface>(null);

    const handleUpdated = () => { setCurrentLink(null); loadData(); }
    const getEditContent = () => { return <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a> }
    const loadData = () => { ApiHelper.apiGet('/links').then(data => setLinks(data)); }
    const saveChanges = () => { ApiHelper.apiPost('/links', links).then(loadData); }

    const handleAdd = () => {
        var link: LinkInterface = { churchId: 1, sort: 0, text: "", url: "" }
        setCurrentLink(link);
        loadData();
    }

    const moveUp = (idx: number) => {
        links[idx - 1].sort++;
        links[idx].sort--;
        saveChanges();
    }

    const moveDown = (idx: number) => {
        links[idx].sort++;
        links[idx + 1].sort--;
        saveChanges();
    }

    const getLinks = () => {
        var idx = 0;
        var rows: JSX.Element[] = [];
        links.forEach(link => {
            const upLink = (idx === 0) ? null : <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); moveUp(idx); }}><i className="fas fa-arrow-up"></i></a>
            const downLink = (idx === links.length - 1) ? null : <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); moveDown(idx); }}><i className="fas fa-arrow-down"></i></a>
            rows.push(
                <tr>
                    <td><a href={link.url}>{link.text}</a></td>
                    <td className="text-right">
                        {upLink}
                        {downLink}
                        <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setCurrentLink(link); }}><i className="fas fa-pencil-alt"></i></a>
                    </td>
                </tr>
            );
            idx++;
        })
        return rows;
    }

    React.useEffect(() => { loadData(); }, []);

    if (currentLink !== null) return <LinkEdit currentLink={currentLink} updatedFunction={handleUpdated} />;
    else return (
        <DisplayBox headerIcon="far fa-square" headerText="Buttons" editContent={getEditContent()} >
            <table className="table table-sm">
                {getLinks()}
            </table>
        </DisplayBox>
    );
}