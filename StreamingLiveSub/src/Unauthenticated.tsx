import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Login } from './Login'
import { Forgot } from './Forgot'
import { Home } from './Home'

export const Unauthenticated = () => {
    return (
        <>
            <Switch>
                <Route path="/login" component={Login} ></Route>
                <Route path="/forgot" component={Forgot} ></Route>
                <Route path="/"><Home /></Route>
            </Switch>
        </>
    )
}
