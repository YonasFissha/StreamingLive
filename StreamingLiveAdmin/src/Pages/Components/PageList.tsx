import React from 'react';
import { DisplayBox, PageInterface } from '.'

interface Props { pages: PageInterface[], addFunction?: () => void, editFunction?: (page: PageInterface) => void }

export const PageList: React.FC<Props> = (props) => {
    const getEditContent = () => { return <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a> }
    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        props.addFunction();
    }

    const getRows = () => {
        var rows: JSX.Element[] = [];
        props.pages.forEach(page => {
            rows.push(
                <tr>
                    <td>{page.name}</td>
                    <td className="text-right">
                        <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); props.editFunction(page); }}><i className="fas fa-pencil-alt"></i></a>
                    </td>
                </tr>
            );
        })
        return rows;
    }

    return (
        <DisplayBox headerIcon="fas fa-code" headerText="Buttons" editContent={getEditContent()} >
            <table className="table table-sm">
                {getRows()}
            </table>
        </DisplayBox>
    );
}