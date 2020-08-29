import React from 'react';
import { DisplayBox, LinkInterface, LinkEdit, ApiHelper } from '.'
import { UserHelper } from '../../Utils';
import { propTypes } from 'react-bootstrap/esm/Image';

interface Props { updatedFunction?: () => void }

export const Links: React.FC<Props> = (props) => {
    const [links, setLinks] = React.useState<LinkInterface[]>([]);
    const [currentLink, setCurrentLink] = React.useState<LinkInterface>(null);

    const handleUpdated = () => { setCurrentLink(null); loadData(); props.updatedFunction() }
    const getEditContent = () => { return <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a> }
    const loadData = () => { ApiHelper.apiGet('/links').then(data => setLinks(data)); }
    const saveChanges = () => { ApiHelper.apiPost('/links', links).then(loadData); }

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        var link: LinkInterface = { churchId: UserHelper.currentChurch.id, sort: links.length, text: "", url: "" }
        setCurrentLink(link);
    }

    const makeSortSequential = () => {
        for (let i = 0; i < links.length; i++) links[i].sort = i + 1;
    }

    const moveUp = (e: React.MouseEvent) => {
        e.preventDefault();
        const idx = parseInt(e.currentTarget.getAttribute("data-idx"));
        makeSortSequential();
        links[idx - 1].sort++;
        links[idx].sort--;
        saveChanges();
    }

    const moveDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const idx = parseInt(e.currentTarget.getAttribute("data-idx"));
        makeSortSequential();
        links[idx].sort++;
        links[idx + 1].sort--;
        saveChanges();
    }

    const getLinks = () => {
        var idx = 0;
        var rows: JSX.Element[] = [];
        console.log(links);
        links.forEach(link => {
            const upLink = (idx === 0) ? null : <a href="about:blank" data-idx={idx} onClick={moveUp}><i className="fas fa-arrow-up"></i></a>
            const downLink = (idx === links.length - 1) ? null : <a href="about:blank" data-idx={idx} onClick={moveDown}><i className="fas fa-arrow-down"></i></a>
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
        <DisplayBox headerIcon="fas fa-link" headerText="Links" editContent={getEditContent()} >
            <table className="table table-sm">
                {getLinks()}
            </table>
        </DisplayBox>
    );
}