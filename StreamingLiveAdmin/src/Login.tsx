import React from 'react';
import { ErrorMessages, ApiHelper, LoginResponseInterface, UserHelper, EnvironmentHelper } from './Components';
import UserContext from './UserContext'
import { Button, FormControl } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';

interface LoginResponse { apiToken: string, name: string }


export const Login: React.FC = (props: any) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState([]);

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
        const btn = e.currentTarget;


        if (validate()) {
            btn.setAttribute("disabled", "disabled");
            btn.innerHTML = "Please wait..";
            login({ email: email, password: password });
        }
    }

    const init = () => {
        let search = new URLSearchParams(window.location.search);
        var jwt = search.get("jwt");
        var auth = search.get('auth');; 
        if (auth !== null && auth !== '') login({ authGuid: auth });
        if (jwt !== "undefined" && jwt !== "") { login({ jwt: jwt }); }
    }

    const login = (data: {}) => {
        ApiHelper.apiPostAnonymous(EnvironmentHelper.AccessManagementApiUrl + '/users/login', data).then((resp: LoginResponseInterface) => {
            ApiHelper.jwt = resp.token;
            ApiHelper.amJwt = resp.token;
            UserHelper.user = resp.user;
            UserHelper.churches = [];
            resp.churches.forEach(c => {
                var add = false;
                c.apps.forEach(a => { if (a.name === "StreamingLive") add = true; })
                if (add) UserHelper.churches.push(c);
            });
            selectChurch();
        }).catch((e) => {
            window.location.href = '/';
        });
    }
    
    const selectChurch = () => {
        let search = new URLSearchParams(props.location.search);
        var churchId:number = parseInt(search.get("churchId"), 0);
        if (isNaN(churchId) || churchId===0) churchId = UserHelper.churches[0].id;
        UserHelper.selectChurch(churchId, context);
    };



    const context = React.useContext(UserContext)
    React.useEffect(init, []);

    if (context.userName === '' || ApiHelper.jwt === '') {
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
                        <a href={EnvironmentHelper.WebUrl + "/#register"}>Register</a> &nbsp; | &nbsp;
                        <a href="/forgot">Forgot Password</a>&nbsp;
                    </div>
                </div>
            </div>

        );
    } else return <Redirect to="/cp" />

}