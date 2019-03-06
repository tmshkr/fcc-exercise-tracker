import React, { Component } from 'react';
import UserList from './components/UserList';
import ExerciseList from './components/ExerciseList';


import { BrowserRouter, Route, Switch } from "react-router-dom";




class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={"/"} component={UserList} />
          <Route path={"/users"} component={UserList} />
          <Route path={"/user/:username/exercises"} component={ExerciseList} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;