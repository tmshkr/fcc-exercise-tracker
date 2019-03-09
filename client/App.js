import React, { Component } from 'react';
import UserList from './components/UserList';
import ExerciseList from './components/ExerciseList';
import ExerciseDetail from './components/ExerciseDetail';


import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";




class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={"/"} component={UserList} />
          <Route path={"/users"} component={UserList} />
          <Route path={"/user/:username/exercises"} component={ExerciseList} />
          <Route path={"/user/:username/exercise/:id"} component={ExerciseDetail} />
          <Redirect to="/"/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;