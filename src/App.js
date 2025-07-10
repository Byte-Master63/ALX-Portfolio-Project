import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="container">
          <Switch>
            <Route exact path="/" component={Dashboard} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
