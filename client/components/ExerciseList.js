import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import Button from '@material-ui/core/Button';


import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { Link } from "react-router-dom";


const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    width: "100%",
  }
});


class ExerciseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newExercise: '',
      error: null
    }
  }
  
  addExercise(title) {
    const { data, mutate } = this.props;
    const { id } = data.user;
		mutate({
      variables: { title, userId: id }
    })
    .then(({ data }) => {
      const { error } = data.addExercise;
      if(error) this.displayError(error);
    })
    .then(() => data.refetch());
  }
  
  handleChange(e, name) {
    this.setState({ [name]: e.target.value });
  };
  
  hanldeKeyPress(e) {
    if (e.which === 13) {
      this.addExercise(this.state.newExercise);
      this.setState({ newExercise: ''});
      e.target.blur()
    }
  }
  
  renderListItem(exercise) {
    const { id, title } = exercise;
    return (
      <ListItem button key={id}>
        <ListItemIcon>
          <FitnessCenterIcon />
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    );
  }
  
  render() {
    const { classes, data } = this.props;
    const { error } = this.state;
    
    if(!data.user) return <div></div>;
    
    const { exercises } = data.user;
    
    return (
      <div className={classes.root}>
        <List component="nav">
          <ListItem>
            <TextField
              error={error && true}
              disabled={error && true}
              label={error || "Add Exercise"}
              value={error ? "" : this.state.newExercise}
              onChange={e => this.handleChange(e, "newExercise")}
              onKeyPress={this.hanldeKeyPress.bind(this)}
              className={classNames(classes.textField)}
            />
          </ListItem>
          { exercises && exercises.map(exercise => this.renderListItem(exercise))}
        </List>
        <Button component={Link} to="/users">
          Go Back
        </Button>
      </div>
    );
  }
}

ExerciseList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mutation = gql`
mutation AddExercise($userId: ID! $title: String!) {
  addExercise(userId: $userId, title: $title) {
    id
    title
  }
}
`

const query = gql`
query GetUserExercises($username: String!){
  user(username: $username) {
    id
    exercises {
      id
      title
    }
  }
}
`

export default graphql(mutation)(graphql(query, {
	options: ({ match }) => ({
		variables: {
			username: match.params.username
		}
	})
})(withStyles(styles)(ExerciseList)))