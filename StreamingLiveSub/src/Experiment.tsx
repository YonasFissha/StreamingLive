
import React from 'react';
import { ErrorMessages, ApiHelper, LoginResponseInterface, UserHelper, SwitchAppRequestInterface, ChatHelper, EnvironmentHelper, ConfigHelper } from './components';
import UserContext from './UserContext'
import { Button, FormControl } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import './Login.css';




export const Experiment: React.FC = (props: any) => {

    const fbConnect = () => {
        var url = "https://streaming-graph.facebook.com/{live-video-id}/live_comments?access_token=[token]&comment_rate=one_per_two_seconds&fields=from{name,id},message";
        fbGet(url);
    }

    const fbGet = async (url: string) => {
        const requestOptions = { method: 'GET' };
        return fetch(url).then(response => response.json())
    }


    return (<></>);

}

