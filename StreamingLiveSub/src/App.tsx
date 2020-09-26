import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserProvider } from './UserContext'
import { Logout } from './Logout';
import { ApiHelper } from './helpers';
import { Unauthenticated } from "./Unauthenticated"
import { Authenticated } from "./Authenticated"

const App: React.FC = () => {
    const getHandler = () => { return (ApiHelper.jwt === '') ? <Unauthenticated /> : <Authenticated />; }

    return (
        <UserProvider>
            <Router>
                <Switch>
                    <Route path="/logout"><Logout /></Route>
                    <Route path="/">{getHandler()}</Route>
                </Switch>
            </Router>
        </UserProvider>
    );
}
export default App;

