import React from "react";
import { ErrorMessages, ApiHelper, UserHelper, EnvironmentHelper, LoginResponseInterface, ConfigHelper, SwitchAppRequestInterface } from "./components";
import { Authenticated } from "./Authenticated";
import UserContext from "./UserContext";
import { Button, FormControl, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./Login.css";

export const Login: React.FC = (props: any) => {
    const [welcomeBackName, setWelcomeBackName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errors, setErrors] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    let { from } = (useLocation().state as any) || { from: { pathname: "/", }, };

    const handleKeyDown = (e: React.KeyboardEvent<any>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(null);
        }
    };

    const getCookieValue = (a: string) => {
        var b = document.cookie.match("(^|;)\\s*" + a + "\\s*=\\s*([^;]+)");
        return b ? b.pop() : "";
    };

    const validate = () => {
        var errors = [];
        if (email === "") errors.push("Please enter your email address.");
        if (password === "") errors.push("Please enter your password.");
        setErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = (e: React.MouseEvent) => {
        if (e !== null) e.preventDefault();
        if (validate()) { login({ email: email, password: password }); }
    };

    const init = () => {
        let search = new URLSearchParams(props.location.search);

        var jwt = search.get("jwt") || getCookieValue("jwt");
        let authGuid = search.get("auth");

        if (authGuid !== "undefined" && authGuid !== null) {
            login({ authGuid: authGuid });
        }

        if (jwt !== "undefined" && jwt !== "") {
            setEmail(getCookieValue("email"));
            login({ jwt: jwt });
            setWelcomeBackName(getCookieValue("name"));
        }

        console.log(document.cookie);
    };

    const handleLoginSuccess = (resp: LoginResponseInterface) => {
        if (Object.keys(resp).length !== 0) {
            document.cookie = "jwt=" + resp.token;
            document.cookie = "name=" + resp.user.displayName;
            document.cookie = "email=" + resp.user.email;

            ApiHelper.jwt = resp.token;
            ApiHelper.amJwt = resp.token;
            UserHelper.user = resp.user;
            UserHelper.churches = [];
            resp.churches.forEach((c) => {
                var add = false;
                c.apps.forEach((a) => { if (a.name === "StreamingLive") add = true; });
                if (add) UserHelper.churches.push(c);
            });
            selectChurch();
        }
    }

    const handleLoginErrors = (errors: string[]) => {
        setWelcomeBackName("");
        if (errors[0] === "No permissions") setErrors(["This login does not have access to StreamingLive."]);
        else setErrors(["Invalid login. Please check your email or password."]);
        setLoading(false);
    }

    const login = (data: any) => {
        data.appName = "StreamingLive";
        setLoading(true);
        ApiHelper.apiPostAnonymous(EnvironmentHelper.AccessManagementApiUrl + "/users/login", data)
            .then((resp: LoginResponseInterface) => {
                if (resp.errors !== undefined) handleLoginErrors(resp.errors);

                else handleLoginSuccess(resp);
            })
            .catch((e) => { setErrors([e.toString()]); throw e; });
    };

    const selectChurch = () => {
        UserHelper.churches?.forEach(c => {
            var churchId: string = c.id?.toString() || "";
            if (churchId === ConfigHelper.current.churchId.toString()) UserHelper.currentChurch = c;
        });
        if (UserHelper.currentChurch === undefined && UserHelper.churches !== undefined && UserHelper.churches.length > 0) UserHelper.currentChurch = UserHelper.churches[0];
        if (UserHelper.currentChurch !== undefined) {
            const data: SwitchAppRequestInterface = { appName: "StreamingLive", churchId: UserHelper.currentChurch?.id || 0 };
            ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/users/switchApp', data).then((resp: LoginResponseInterface) => {
                ApiHelper.jwt = resp.token;
                context?.setUserName(UserHelper.user?.displayName || "");
            });
        }
    }

    const getWelcomeBack = () => {
        if (welcomeBackName === "") return null;
        else return (<Alert variant="info">Welcome back, <b>{welcomeBackName}</b>! Please wait while we load your data.</Alert>);
    };

    const context = React.useContext(UserContext);
    React.useEffect(init, []);

    if (context.userName === "" || ApiHelper.jwt === "") {
        return (
            <div className="smallCenterBlock"><img src="/images/logo-login.png" alt="logo" className="img-fluid" style={{ marginBottom: 50 }} />
                <ErrorMessages errors={errors} />
                {getWelcomeBack()}
                {!welcomeBackName && (
                    <div id="loginBox">
                        <h2>Please sign in</h2>
                        <FormControl id="email" name="email" value={email} onChange={(e) => { e.preventDefault(); setEmail(e.currentTarget.value); }} placeholder="Email address" onKeyDown={handleKeyDown} />
                        <FormControl id="password" name="password" type="password" placeholder="Password" value={password} onChange={(e) => { e.preventDefault(); setPassword(e.currentTarget.value); }} onKeyDown={handleKeyDown} />
                        <Button id="signInButton" size="lg" variant="primary" block onClick={!loading ? handleSubmit : null} disabled={loading} >
                            {loading ? "Please wait..." : "Sign in"}
                        </Button>
                        <br />
                        <div className="text-right">
                            <a href="/forgot">Forgot Password</a>&nbsp;
            </div>
                    </div>
                )}
            </div>
        );
    } else {
        let path = from.pathname === "/" ? "/settings" : from.pathname;
        return <Authenticated location={path}></Authenticated>;
    }
};
