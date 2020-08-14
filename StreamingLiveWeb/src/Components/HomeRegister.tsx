import React from 'react';
import { ApiHelper } from '../Utils';

export const HomeRegister: React.FC = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [churchName, setChurchName] = React.useState("");
    const [subDomain, setSubDomain] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        switch (e.currentTarget.name) {
            case 'email': setEmail(val); break;
            case 'password': setPassword(val); break;
            case 'churchName': setChurchName(val); break;
            case 'subDomain': setSubDomain(val); break;
        }
    }

    const handleRegister = (e: React.MouseEvent) => {
        //Register
        //ApiHelper.apiPostAnonymous

    }

    return (
        <div id="register">
            <div className="container">
                <div className="text-center">
                    <h2 style={{ marginBottom: 20 }}>Register <span>Your Church</span></h2>
                </div>

                <div className="row">
                    <div className="col-lg-6">
                        <p>This is a <b><u>completely free</u></b> service offered to churches by Live Church Solutions, a 501(c)3.</p>
                        <p>If you would like to help support our mission of enabling churches to thrive with technology solutions, please consider <a href="/donate/">donating</a>.</p>
                    </div>
                    <div className="col-lg-6">

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
                                <a href="about:blank" className="btn btn-lg btn-primary btn-block" onClick={handleRegister}>Register</a>
                            </form>
                            <br />
                            <div>
                                Already have a site? <a href="/cp/">Login</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
