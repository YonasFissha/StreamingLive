import React from 'react';
import UserContext from './UserContext'
import { Authenticated } from './Authenticated'
import { Unauthenticated } from './Unauthenticated'
import { Switch, Route } from "react-router-dom";
import { Logout } from './Logout';
import { ApiHelper } from './helpers'

export const ControlPanel = () => {
    var user = React.useContext(UserContext)?.userName; //to force rerender on login
    if (user === null || ApiHelper.jwt === '') <Unauthenticated />;
    else return <Authenticated />;
}
