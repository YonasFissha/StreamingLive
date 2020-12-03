import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { SettingsPage } from './Settings/SettingsPage';
import { UsersPage } from './Users/UsersPage';
import { Pages } from './Pages/Pages';
import { Header } from "./Components";
import { ChatPage } from './Chat/ChatPage';
import { ProfilePage } from './Profile/ProfilePage';
import { UserHelper } from "./Utils"
import UserContext from "./UserContext";

interface Props { location: any; }

export const Authenticated: React.FC<Props> = (props) => {
    var user = React.useContext(UserContext)?.userName; //to force rerender on login
    const defaultRedirect = (UserHelper.checkAccess('Settings', 'Edit')) ? <Redirect to="/settings" /> : <Redirect to="/chat" />
    return (
        <>
            <Header></Header>
            <div className="container">
                <Switch>
                    <Route path="/login"><Redirect to={props.location} /></Route>
                    <Route path="/settings"><SettingsPage /></Route>
                    <Route path="/pages"><Pages /></Route>
                    <Route path="/profile"><ProfilePage /></Route>
                    <Route path="/users"><UsersPage /></Route>
                    <Route path="/chat"><ChatPage /></Route>
                </Switch>

            </div>
            <script src="/js/cp.js"></script>
        </>
    );
}


