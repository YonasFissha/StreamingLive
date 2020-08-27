import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserProvider } from './UserContext'
import { Home } from "./Home"
import { Login } from './Login';
import { Logout } from './Logout';

const App: React.FC = () => {
    return (
        <UserProvider>
            <Router>
                <Switch>
                    <Route path="/login"><Login /></Route>
                    <Route path="/logout"><Logout /></Route>
                    <Route path="/"><Home /></Route>
                </Switch>
            </Router>
        </UserProvider>
    );
}
export default App;

