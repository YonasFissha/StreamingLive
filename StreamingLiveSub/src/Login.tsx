import React from 'react';
import { ErrorMessages, ApiHelper, LoginResponseInterface, UserHelper, SwitchAppRequestInterface, ChatHelper, EnvironmentHelper, ConfigHelper } from './components';
import UserContext from './UserContext'
import { Button, FormControl } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import './Login.css';

interface LoginResponse { apiToken: string, name: string }


export const Login: React.FC = (props: any) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState<string[]>([]);

    //const getCookieValue = (a: string) => { var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)'); return b ? b.pop() : ''; }
    const validate = () => {
        var errors = [];
        if (email === '') errors.push('Please enter your email address.');
        if (password === '') errors.push('Please enter your password.');
        setErrors(errors);
        return errors.length === 0;
    }

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        if (validate()) login({ email: email, password: password });
    }

    const init = () => {
        const keyName = window.location.hostname.split('.')[0];
        ConfigHelper.load(keyName).then(() => {
            let search = new URLSearchParams(window.location?.search || "");
            var auth = search.get('auth');;
            if (auth !== undefined && auth !== null && auth !== '') login({ authGuid: auth });
        })

    }

    const login = (data: {}) => {
        ApiHelper.apiPostAnonymous(EnvironmentHelper.AccessManagementApiUrl + '/users/login', data).then((resp: LoginResponseInterface) => {
            ApiHelper.jwt = resp.token;
            ApiHelper.amJwt = resp.token;
            UserHelper.user = resp.user;
            UserHelper.churches = resp.churches;
            UserHelper.isHost = true;
            selectChurch();
        });
    }

    const selectChurch = () => {

        UserHelper.churches?.forEach(c => {
            var churchId: string = c.id?.toString() || "";
            if (churchId === ConfigHelper.current.churchId.toString()) UserHelper.currentChurch = c;
        });
        if (UserHelper.currentChurch !== undefined) {
            const data: SwitchAppRequestInterface = { appName: "StreamingLive", churchId: UserHelper.currentChurch?.id || 0 };
            ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/users/switchApp', data).then((resp: LoginResponseInterface) => {
                ApiHelper.jwt = resp.token;
                context?.setUserName(UserHelper.user?.displayName || "");
            });
        }
    }

    const context = React.useContext(UserContext)
    React.useEffect(init, []);

    if (context?.userName === '' || ApiHelper.jwt === '') {
        return (

            <div className="smallCenterBlock">
                <img src="/images/logo-login.png" alt="logo" className="img-fluid" style={{ marginBottom: 50 }} />
                <ErrorMessages errors={errors} />
                <div id="loginBox">
                    <h2>Please sign in</h2>
                    <FormControl id="email" name="email" value={email} onChange={e => { e.preventDefault(); setEmail(e.currentTarget.value) }} placeholder="Email address" />
                    <FormControl id="password" name="password" type="password" placeholder="Password" value={password} onChange={e => { e.preventDefault(); setPassword(e.currentTarget.value) }} />
                    <Button id="signInButton" size="lg" variant="primary" block onClick={handleSubmit} >Sign in</Button>
                    <br />
                    <div className="text-right">
                        <a href="/forgot">Forgot Password</a>&nbsp;
                    </div>
                </div>
            </div>

        );
    } else return <Redirect to="/" />

}