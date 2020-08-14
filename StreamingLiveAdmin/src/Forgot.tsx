import React from 'react';
import { ErrorMessages, ApiHelper } from './Components';
import { Button } from 'react-bootstrap';

interface ForgotResponse { emailed: boolean }

export const Forgot = () => {
    const [email, setEmail] = React.useState('');
    const [errors, setErrors] = React.useState([]);
    const [successMessage, setSuccessMessage] = React.useState<React.ReactElement>(null);

    const validate = () => {
        var errors = [];
        if (email === '') errors.push('Please enter your email address.');
        setErrors(errors);
        return errors.length === 0;
    }

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        if (validate()) reset(email);
    }

    const reset = (email: string) => {
        var data = { Email: email };
        const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
        fetch(ApiHelper.baseUrl + '/users/forgot', requestOptions).then(response => response.json()).then(data => {
            var d = data as ForgotResponse;
            if (d.emailed) {
                setErrors([]);
                setSuccessMessage(<div className="alert alert-success" role="alert">Password reset email sent</div>);
            } else {
                setErrors(['We could not find an account with this email address']);
                setSuccessMessage(<></>);
            }
        });

    }

    return (
        <div className="smallCenterBlock">
            <ErrorMessages errors={errors} />
            {successMessage}
            <div id="loginBox">
                <h2>Reset Password</h2>
                <p>Enter your email address to request a password reset.</p>
                <input name="email" type="text" className="form-control" value={email} onChange={e => { e.preventDefault(); setEmail(e.currentTarget.value) }} placeholder="Email address" />
                <Button size="lg" variant="primary" block onClick={handleSubmit}>Reset</Button>
                <br />
                <div className="text-right"><a href="https://streaminglive.church/#register">Register</a> &nbsp; | &nbsp;<a href="/login">Login</a>&nbsp;</div>
            </div>
        </div>
    );


}