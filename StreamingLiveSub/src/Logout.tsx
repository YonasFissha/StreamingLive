import React from 'react';
import { Redirect } from 'react-router-dom';
import { ApiHelper, UserHelper, ChatHelper } from './components';
import UserContext from './UserContext'

export const Logout = () => {
    const context = React.useContext(UserContext)
    document.cookie = "jwt=";
    document.cookie = "email=";
    document.cookie = "name=";
    console.log(document.cookie);
    ApiHelper.jwt = '';
    ApiHelper.amJwt = '';
    ChatHelper.setName("Anonymous");
    UserHelper.user.displayName = "Anonymous";
    UserHelper.isHost = false;
    context?.setUserName('');
    return <Redirect to="/" />
}