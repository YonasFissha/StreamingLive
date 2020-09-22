import React from 'react';
import './App.css';
import { Privacy } from './Privacy';
import { Terms } from './Terms';
import { Home } from './Home';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/privacy"><Privacy /></Route>
        <Route path="/terms"><Terms /></Route>
        <Route path="/"><Home /></Route>
      </Switch>
    </Router>
  );
}
export default App;

