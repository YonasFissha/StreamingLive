import React from 'react';
import { Row, Col, FormGroup } from 'react-bootstrap'
import { InputBox, UserHelper, EnvironmentHelper, ApiHelper } from './components'
import { Redirect } from 'react-router-dom';


export const ProfilePage = () => {
    const [displayName, setDisplayName] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [redirectUrl, setRedirectUrl] = React.useState<string>("");

    const handleSave = () => {
        const promises: Promise<any>[] = [];
        if (displayName.length > 0) promises.push(ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + "/users/setDisplayName", { displayName: displayName }));
        if (password.length > 5) promises.push(ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + "/users/updatePassword", { newPassword: password }));

        Promise.all(promises).then(() => {
            UserHelper.user.displayName = displayName;
            setRedirectUrl("/");
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

    React.useEffect(() => { setDisplayName(UserHelper.user?.displayName || ""); }, []);
    
    
    if (redirectUrl!=="") return <Redirect to={redirectUrl} />
    else return (
        <>

            <div className="smallCenterBlock">
                <img src="/images/logo-login.png" alt="logo" className="img-fluid" style={{ marginBottom: 50 }} />

                <InputBox headerIcon="fas fa-user" headerText="Edit Profile" saveFunction={handleSave}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <label>Display Name</label>
                                <input type="text" name="name" value={displayName} onChange={handleChange} className="form-control" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <label>Password</label>
                                <input type="password" name="password" value={password} onChange={handleChange} className="form-control" />
                            </FormGroup>
                        </Col>
                    </Row>
                </InputBox>
            </div>

   
        </>
    );
}
