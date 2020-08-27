import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { Home } from "./Home"
import { Logout } from './Logout';

export const Authenticated: React.FC = () => {
    return (
        <Switch>
            <Route path="/login"><Redirect to="/" /></Route>
            <Route path="/logout"><Logout /></Route>
            <Route path="/"><Home /></Route>
        </Switch>
    );
}

