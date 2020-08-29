import React from 'react';
import { Row, Col, FormGroup } from 'react-bootstrap'
import { InputBox, UserHelper, EnvironmentHelper, ApiHelper } from './Components'


export const ProfilePage = () => {
    const [displayName, setDisplayName] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");

    const handleSave = () => {
        const promises: Promise<any>[] = [];
        if (displayName.length > 0) promises.push(ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + "/users/setDisplayName", { displayName: displayName }));
        if (password.length > 5) promises.push(ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + "/users/updatePassword", { newPassword: password }));

        Promise.all(promises).then(() => {
            UserHelper.user.displayName = displayName;
            window.alert("Changes saved.");
        });

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        switch (e.currentTarget.name) {
            case "name":
                setDisplayName(val);
                break;
            case "password":
                setPassword(val);
                break;
        }

    }

    React.useEffect(() => { setDisplayName(UserHelper.user.displayName); }, []);

    return (
        <>
            <Row style={{ marginBottom: 25 }}>
                <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-user"></i> Edit Profile</h1></div>
            </Row>
            <Row>
                <Col md={8}>
                    <InputBox headerIcon="fas fa-user" headerText="Edit Profile" saveFunction={handleSave}>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <label>Display Name</label>
                                    <input type="text" name="name" value={displayName} onChange={handleChange} className="form-control" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>Password</label>
                                    <input type="password" name="password" value={password} onChange={handleChange} className="form-control" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </InputBox>
                </Col>
                <Col md={4}>

                </Col>
            </Row>
        </>
    );
}
