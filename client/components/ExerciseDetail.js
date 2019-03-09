import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { graphql } from "react-apollo";
import gql from "graphql-tag";

// import MomentUtils from '@date-io/moment';
import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
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
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  datePicker: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});



class ExerciseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      duration: 0,
      description: '',
      title: '',
      initialState: true
    }
  }
  
  componentDidMount () {
    const { initialState } = this.state;
    if (initialState) {
      this.loadDataIntoState();
    }
  }
  
  componentDidUpdate () {
    const { initialState } = this.state;
    if (initialState) {
      this.loadDataIntoState();
    }
  }
  
  loadDataIntoState() {
    const { data } = this.props;
    if (data && data.exercise) {
      const { title, date, duration, description } = data.exercise;
      this.setState({
        title,
        date: new Date(date),
        duration,
        description,
        initialState: false
      });
    }
  }
  
  handleChange(e, name) {
    this.setState({ [name]: e.target.value });
  };
  
  handleDateChange(date) {
    this.setState({ date });
  };
  
  updateData() {
    const { match, mutate } = this.props;
    const { title, date, duration, description } = this.state;
		mutate({
      variables: {
        id: match.params.id,
        title,
        date: date.ts,
        duration,
        description
      }
		});
	}
  
  render() {
    const { classes, data, history } = this.props;
    const { error, date, initialState } = this.state;
    
    if(initialState) return <div></div>;
        
    
    return (
      
        <div className={classes.root}>
          <Button onClick={history.goBack}>
            Go Back
          </Button>
          <TextField
            label="Title"
            className={classes.textField}
            value={this.state.title}
            onChange={e => this.handleChange(e, 'title')}
            margin="normal"
            variant="outlined"
          />
          <form className={classes.container} noValidate autoComplete="off">
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <DatePicker
                margin="normal"
                label="Date picker"
                className={classes.datePicker}
                value={date}
                onChange={this.handleDateChange.bind(this)}
              />
            </MuiPickersUtilsProvider>
            <TextField
              label="Duration"
              value={this.state.duration}
              onChange={e => this.handleChange(e, 'duration')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <TextField
              label="Description"
              className={classes.textField}
              value={this.state.description}
              onChange={e => this.handleChange(e, 'description')}
              margin="normal"
              variant="outlined"
            />
            <Button onClick={this.updateData.bind(this)}>
              Update
            </Button>
          </form>
        </div>
      
    )
  }
}

ExerciseDetail.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mutation = gql`
mutation EditExercise(
  $id: ID! 
  $title: String 
  $description: String 
  $duration: Int 
  $date: Float
) {
  editExercise(
    id: $id
    title: $title
    description: $description
    duration: $duration
  	date: $date
  ) {
    id
    title
    description
    duration
    date
    userId
    username
  }
}
`

const query = gql`
query GetExercise($id: ID!){
  exercise(id: $id) {
    id
    title
    date
    duration
    description
    userId
  }
}
`


export default graphql(mutation)(graphql(query, {
	options: ({ match }) => ({
		variables: {
			id: match.params.id
		}
	})
})(withStyles(styles)(ExerciseDetail)))