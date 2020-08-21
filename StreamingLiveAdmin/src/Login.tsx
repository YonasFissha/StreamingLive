import React from 'react';
import { ErrorMessages, ApiHelper, LoginResponseInterface, UserHelper } from './Components';
import UserContext from './UserContext'
import { Button, FormControl } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';

interface LoginResponse { apiToken: string, name: string }


export const Login: React.FC = (props: any) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState([]);

    const getCookieValue = (a: string) => { var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)'); return b ? b.pop() : ''; }
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
        let search = new URLSearchParams(props.location.search);
        var apiKey = search.get('guid') || getCookieValue('apiKey');
        if (apiKey !== '') login({ resetGuid: apiKey });
    }

    const login = (data: {}) => {
        ApiHelper.apiPostAnonymous(process.env.REACT_APP_ACCESSMANAGEMENT_API_URL + '/users/login', data).then((resp: LoginResponseInterface) => {
            ApiHelper.jwt = resp.token;
            UserHelper.user = resp.user;
            UserHelper.churches = resp.churches;
            UserHelper.currentChurch = resp.churches[0];
            context.setUserName(resp.user.displayName);
        });
    }

    const context = React.useContext(UserContext)
    React.useEffect(init, []);

    if (context.userName === '' || ApiHelper.jwt === '') {
        return (

            <div className="smallCenterBlock">

                <ErrorMessages errors={errors} />
                <div id="loginBox">
                    <h2>Please sign in</h2>
                    <FormControl id="email" name="email" value={email} onChange={e => { e.preventDefault(); setEmail(e.currentTarget.value) }} placeholder="Email address" />
                    <FormControl id="password" name="password" type="password" placeholder="Password" value={password} onChange={e => { e.preventDefault(); setPassword(e.currentTarget.value) }} />
                    <Button id="signInButton" size="lg" variant="primary" block onClick={handleSubmit} >Sign in</Button>
                    <br />
                    <div className="text-right">
                        <a href="https://streaminglive.church/#register">Register</a> &nbsp; | &nbsp;
                        <a href="/forgot">Forgot Password</a>&nbsp;
                    </div>
                </div>
            </div>

        );
    } else return <Redirect to="/cp" />

}