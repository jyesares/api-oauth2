import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import { Disconnected, DialogLogin } from './pages';

class App extends Component {
  render() {
    return (
      <div>
        <Disconnected />
        <Route path="/dialog/login" component={DialogLogin} />
      </div>
    );
  }
}

export default App;
