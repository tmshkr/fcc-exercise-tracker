import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    width: "100%"
  },
  dialog: {
    margin: theme.spacing.unit * 5
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
		
    mutate({ variables: { title, userId: id }})
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
    }
  }
  
  renderListItem(exercise) {
    const { id, title } = exercise;
    const { history, match } = this.props;
    const { username } = match.params;
    
    const url = `/user/${username}/exercise/${id}`;
    
    return (
      <ListItem
        button
        key={id}
        onClick={() => history.push(url)}
      >
        <ListItemIcon>
          <FitnessCenterIcon />
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    );
  }
  
  render() {
    const { classes, data, history } = this.props;
    const { error } = this.state;
    
    if(!data.user) return <div></div>;
    
    const { exercises } = data.user;
    
    const noExercisesDialog = (
      <div className={classes.dialog}>
        <Typography component="p" variant="subtitle1" gutterBottom>
          Add an exercise to get started
        </Typography>
      </div>
    )
    
    return (
      <div className={classes.root}>
        <List component="nav">
          <Button onClick={history.goBack}>
            Go Back
          </Button>
          { (exercises.length > 0)
            ? exercises.map(exercise => this.renderListItem(exercise))
            : noExercisesDialog }
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
        </List>
      </div>
    );
  }
}

ExerciseList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
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