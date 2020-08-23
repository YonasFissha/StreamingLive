import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { SettingsPage } from './Settings/SettingsPage';
import { Pages } from './Pages/Pages';
import { Header } from "./Components";

export const Authenticated = () => {

    return (
        <>
            <link rel="stylesheet" href="/css/cp.css" />
            <Header></Header>
            <div className="container">
                <Switch>
                    <Route path="/login"  ><Redirect to="/settings" /></Route>
                    <Route path="/settings"><SettingsPage /></Route>
                    <Route path="/pages"><Pages /></Route>
                </Switch>

            </div>
            <script src="/js/cp.js"></script>
        </>
    );
}

