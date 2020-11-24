import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { Home } from "./Home"
import { Logout } from './Logout';
import { ProfilePage } from './profile/ProfilePage';

export const Authenticated: React.FC = () => {
    console.log("AUTHENTICATED");
    return (
        <Switch>
            <Route path="/profile"><ProfilePage /></Route>
            <Route path="/login"><Redirect to="/" /></Route>
            <Route path="/forgot"  ><Redirect to="/" /></Route>
            <Route path="/logout"><Logout /></Route>
            <Route path="/"><Home /></Route>
        </Switch>
    );
}

