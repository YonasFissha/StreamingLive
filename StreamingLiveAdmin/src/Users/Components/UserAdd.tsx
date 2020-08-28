import React from 'react';
import { InputBox, RoleInterface } from '.'
import { FormGroup } from 'react-bootstrap';
import { ApiHelper, UserInterface, RoleMemberInterface, UserHelper } from './';
import { EnvironmentHelper } from '../../Utils';

interface Props {
    role: RoleInterface,
    updatedFunction: () => void
}

export const UserAdd: React.FC<Props> = (props) => {
    const [email, setEmail] = React.useState("");

    const handleSave = () => {
        const user: UserInterface = { email: email, displayName: email };
        ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/users/loadOrCreate', user).then(u => {
            const rm: RoleMemberInterface = { userId: u.id, roleId: props.role.id, churchId: UserHelper.currentChurch.id };
            ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/rolemembers/', [rm]).then(() => { props.updatedFunction() });
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    }

    return (
        <InputBox headerIcon="fas fa-lock" headerText={"Add to " + props.role.name} saveFunction={handleSave} cancelFunction={props.updatedFunction}  >
            <FormGroup>
                <label>Email</label>
                <input type="email" value={email} onChange={handleChange} className="form-control" />
            </FormGroup>
        </InputBox>
    );
}