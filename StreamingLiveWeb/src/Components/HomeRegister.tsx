import React from 'react';
import { ApiHelper, RegisterInterface, RoleInterface, LoginResponseInterface, RolePermissionInterface, RoleMemberInterface, LinkInterface, TabInterface, ServiceInterface, SettingInterface, ErrorMessages } from './';
import { ChurchInterface, UserInterface, EnvironmentHelper } from '../utils';


export const HomeRegister: React.FC = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [churchName, setChurchName] = React.useState("");
    const [subDomain, setSubDomain] = React.useState("");
    const [errors, setErrors] = React.useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        switch (e.currentTarget.name) {
            case 'email': setEmail(val); break;
            case 'password': setPassword(val); break;
            case 'churchName': setChurchName(val); break;
            case 'subDomain': setSubDomain(val); break;
        }
    }

    const validate = async () => {
        var errors = [];
        if (churchName === '') errors.push('Please enter your church/organization name.');
        if (subDomain === '') errors.push('Please select a subdomain for your site.');
        if (email === '') errors.push('Please enter your email address.');
        if (password === '') errors.push('Please enter a password.');
        /*
        if (errors.length === 0) {
            const chk: any = await ApiHelper.apiGetAnonymous("/settings/checkAvailable/" + subDomain);
            if (!chk.available) errors.push("Sorry, that sub domain is already in use.");
        }*/
        setErrors(errors);
        return errors.length === 0;

    }

    const handleRegister = async (e: React.MouseEvent) => {
        e.preventDefault();
        const btn = e.currentTarget;
        btn.innerHTML = "Validating..."
        if (await validate()) {
            btn.innerHTML = "Registering. Please wait..."
            btn.setAttribute("disabled", "disabled");

            var churchId = 0;

            //Create Access
            churchId = await createAccess();
            if (churchId > 0) {


                btn.innerHTML = "Configuring..."
                var resp: LoginResponseInterface = await ApiHelper.apiPost(EnvironmentHelper.StreamingLiveApiUrl + '/churches/init', {});
                if (resp.errors !== undefined) { setErrors(resp.errors); return 0; }
                else {
                    btn.innerHTML = "Configured.";
                }
                window.location.href = EnvironmentHelper.AdminUrl;
            }
        }
        btn.innerHTML = "Register"
    }

    const createAccess = async () => {
        var data: RegisterInterface = { churchName: churchName, displayName: email, email: email, password: password, subDomain: subDomain };

        var resp: LoginResponseInterface = await ApiHelper.apiPostAnonymous(EnvironmentHelper.AccessManagementApiUrl + '/churches/register', data);
        if (resp.errors !== undefined) { setErrors(resp.errors); return 0; }
        else {
            const church = resp.churches[0];
            ApiHelper.jwt = resp.token;
            var resp: LoginResponseInterface = await ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/churchApps/register', { appName: "StreamingLive" });
            if (resp.errors !== undefined) { setErrors(resp.errors); return 0; }
            else {
                await addHostRole(church, resp.user)
                resp = await ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/users/switchApp', { churchId: church.id, appName: "StreamingLive" });
                ApiHelper.jwt = resp.token;
                return church.id;
            }
        }

    }

    const addHostRole = async (church: ChurchInterface, user: UserInterface) => {
        var role: RoleInterface = { appName: "StreamingLive", churchId: church.id, name: "Hosts" };
        role.id = (await ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/roles', [role]))[0].id;

        const permissions: RolePermissionInterface[] = [];
        permissions.push({ churchId: church.id, contentType: "Chat", action: "Host", roleId: role.id });
        await ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/rolepermissions', permissions);
    }


    return (
        <>
            <div id="register">
                <div className="container">
                    <div className="text-center">
                        <h2 style={{ marginBottom: 20 }}>Register <span>Your Church</span></h2>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <p>This is a <b><u>completely free</u></b> service offered to churches by <a href="https://livecs.org/">Live Church Solutions</a>, a 501(c)3.</p>
                            <p>If you would like to help support our mission of enabling churches to thrive with technology solutions, please consider <a href="/donate/">donating</a>.</p>
                        </div>
                        <div className="col-lg-6">
                            <ErrorMessages errors={errors} />

                            <div id="registerBox">
                                <form method="post">
                                    <div className="form-group">
                                        <input type="text" name="churchName" value={churchName} className="form-control" placeholder="Church Name" onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <input type="text" name="subDomain" className="form-control" placeholder="yourchurch" value={subDomain} onChange={handleChange} />
                                            <div className="input-group-append"><span className="input-group-text">.streaminglive.church</span></div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" name="email" value={email} className="form-control" placeholder="Email Address" onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" name="password" value={password} className="form-control" placeholder="Password" onChange={handleChange} />
                                    </div>
                                    <button className="btn btn-lg btn-primary btn-block" onClick={handleRegister}>Register</button>
                                </form>
                                <br />
                                <div>
                                    Already have a site? <a href={EnvironmentHelper.AdminUrl}>Login</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
