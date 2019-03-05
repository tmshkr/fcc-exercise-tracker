import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';

import { graphql } from "react-apollo";
import gql from "graphql-tag";


const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});



class ExerciseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    }
  }
  
  componentDidMount() {
    
  }
  
  renderListItem(exercise) {
    const { id, description } = exercise;
    return (
      <ListItem button key={id}>
        <ListItemIcon>
          <FitnessCenterIcon />
        </ListItemIcon>
        <ListItemText primary={description} />
      </ListItem>
    );
  }
  
  render() {
    const { classes, data } = this.props;
    
    if(!data.user) return <div></div>;
    
    const { exercises } = data.user;
    
    return (
      <div className={classes.root}>
        <List component="nav">
          { exercises && exercises.map(exercise => this.renderListItem(exercise))}
        </List>
      </div>
    );
  }
}

ExerciseList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mutation = gql`
mutation AddExercise($userId: String! $duration: Int! $date: Float $description: String!) {
  addExercise(userId: $userId duration: $duration date: $date description: $description) {
    id
    userId
    username
    duration
    description
    date
  }
}
`

const query = gql`
query GetUserExercises($id: ID!){
  user(id: $id) {
    exercises {
      id
      duration
      description
      date
    }
  }
}
`

export default graphql(mutation)(graphql(query, {
	options: ({ match }) => ({
		variables: {
			id: match.params.id
		}
	})
})(withStyles(styles)(ExerciseList)))