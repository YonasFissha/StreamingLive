import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserProvider } from './UserContext'
import { Logout } from './Logout';
import { ApiHelper } from './helpers';
import { Unauthenticated } from "./Unauthenticated"
import { Authenticated } from "./Authenticated"
import {Routing} from "./Routing";

const App: React.FC = () => {
    //const getHandler = () => { return (ApiHelper.jwt === '') ? <Unauthenticated /> : <Authenticated />; }
    console.log("APP");

    return (
        <UserProvider>
            <Router>
                <Routing />
            </Router>
        </UserProvider>
    );
}
export default App;

