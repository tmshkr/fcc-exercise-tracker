import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import UserList from './components/UserList';
import ExerciseList from './components/ExerciseList';
import FloatingActionButtons from './components/FloatingActionButtons';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import PersonAddIcon from '@material-ui/icons/PersonAdd';


class App extends Component {
  render() {
    return (
      <div>
        <UserList />
        <Fab color="primary" aria-label="Add" >
          <PersonAddIcon />
        </Fab>
      </div>
    )
  }
}

export default App