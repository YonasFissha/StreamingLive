import React from 'react';
import { Row, Col } from 'react-bootstrap'
import { ApiHelper, RoleInterface, Role, UserAdd } from './Components'


export const UsersPage = () => {
    const [roles, setRoles] = React.useState<RoleInterface[]>(null);
    const [addForRole, setAddForRole] = React.useState<RoleInterface>(null);
    const loadData = () => { ApiHelper.apiGet(process.env.REACT_APP_ACCESSMANAGEMENT_API_URL + '/roles/app/StreamingLive').then((data: RoleInterface[]) => setRoles(data)); }


    const showAdd = (role: RoleInterface) => { setAddForRole(role); }
    const handleAdd = () => { setAddForRole(null); loadData(); }

    const getRoles = () => {
        const result: JSX.Element[] = [];
        roles?.forEach(r => { result.push(<Role role={r} addFunction={showAdd} />) });
        return result;
    }

    const getEdit = () => {
        if (addForRole === null) return null;
        else return <UserAdd role={addForRole} updatedFunction={handleAdd} />
    }

    React.useEffect(() => { loadData(); }, []);

    return (
        <>
            <Row style={{ marginBottom: 25 }}>
                <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-user"></i> Users</h1></div>
            </Row>
            <Row>
                <Col md={8}>
                    {getRoles()}
                </Col>
                <Col md={4}>
                    {getEdit()}
                </Col>
            </Row>
        </>
    );
}
