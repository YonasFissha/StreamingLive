import React from 'react';
import { Redirect } from 'react-router-dom';
import { ApiHelper } from './Utils';
import UserContext from './UserContext'

export const Logout = () => {
    const context = React.useContext(UserContext)


    document.cookie = "jwt=";
    document.cookie = "email=";
    document.cookie = "name=";
    console.log(document.cookie);
    ApiHelper.jwt = '';
    ApiHelper.amJwt = '';
    context.setUserName('');
    return <Redirect to="/" />
}