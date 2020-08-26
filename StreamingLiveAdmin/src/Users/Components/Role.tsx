import React from 'react';
import { DisplayBox } from '.'
import { ApiHelper, RoleInterface, RoleMemberInterface } from './'
import { UserHelper } from '../../Utils';

interface Props { role: RoleInterface, addFunction: (role: RoleInterface) => void }

export const Role: React.FC<Props> = (props) => {

    const [roleMembers, setRoleMembers] = React.useState<RoleMemberInterface[]>(null);

    const getEditContent = () => { return <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a> }

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        props.addFunction(props.role);
    }

    const loadData = () => {
        ApiHelper.apiGet(process.env.REACT_APP_ACCESSMANAGEMENT_API_URL + '/rolemembers/roles/' + props.role.id + "?include=users")
            .then((data: RoleMemberInterface[]) => setRoleMembers(data));
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        const id = parseInt(e.currentTarget.getAttribute("data-id"));
        ApiHelper.apiDelete(process.env.REACT_APP_ACCESSMANAGEMENT_API_URL + '/rolemembers/' + id).then(() => loadData());
    }

    const getMembers = () => {
        const result: JSX.Element[] = [];
        roleMembers?.forEach(rm => {
            const removeLink = (rm.userId === UserHelper.user.id) ? null : <a href="about:blank" data-id={rm.id} onClick={handleDelete} className="text-danger"><i className="fas fa-user-times"></i></a>
            result.push(<tr>
                <td>{rm.user.displayName}</td>
                <td>{rm.user.email}</td>
                <td>{removeLink}</td>
            </tr>);
        });
        return result;
    }

    React.useEffect(() => { if (props.role !== null) loadData(); }, [props.role]);

    return (
        <DisplayBox headerIcon="fas fa-lock" headerText={props.role.name} editContent={getEditContent()}  >
            <table className="table">
                <thead>
                    <tr><th>Name</th><th>Email</th><th>Remove</th></tr>
                </thead>
                <tbody>
                    {getMembers()}
                </tbody>
            </table>

        </DisplayBox>
    );
}