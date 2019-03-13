import React, { Component } from 'react';
import classNames from 'classnames';
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Button from '@material-ui/core/Button';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit
  },
  dense: {
    marginTop: 16,
  },
  description: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  },
  buttonIcon: {
    marginRight: theme.spacing.unit
  },
  title: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "calc(100% - 16px)"
  }
});



class ExerciseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      duration: "",
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
  
  handleDuration(e) {
    const { value } = e.target;
    if (!(value <= 0) && !/\D/.test(value)) { // only accepts non-negative digits
      this.setState({ duration: value });
    }
    else if (value == 0) {
      this.setState({ duration: "" });
    }
  }
  
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
    const { error, date, description, duration, initialState, title } = this.state;
    
    if(initialState) return <div></div>;
            
    
    return (
      
        <div className={classes.root}>
          <form className={classes.container} noValidate autoComplete="off">
            <div style={{width: "100%"}}>
              <TextField
                className={classes.title}
                variant="outlined"
                label="Title"
                value={title}
                onChange={e => this.handleChange(e, 'title')}
                margin="normal"
              />
            </div>
            <div style={{width: "100%"}}>
              <MuiPickersUtilsProvider utils={LuxonUtils}>
                <DatePicker
                  margin="normal"
                  label="Date"
                  variant="outlined"
                  className={classes.datePicker}
                  value={date}
                  onChange={this.handleDateChange.bind(this)}
                />
              </MuiPickersUtilsProvider>
              <TextField
                label="Duration (min)"
                value={duration > 0 ? duration : ""}
                onChange={this.handleDuration.bind(this)}
                variant="outlined"
                className={classes.textField}
                margin="normal"
              />
            </div>
            <TextField
              label="Description"
              className={classes.description}
              multiline
              rows="4"
              value={description}
              onChange={e => this.handleChange(e, 'description')}
              margin="normal"
              variant="outlined"
            />
            <div style={{width: "100%", margin: "16px 0"}}>
              <Button onClick={history.goBack}>
                <KeyboardArrowLeftIcon className={classes.buttonIcon} />
                Go Back
              </Button>
              <Button onClick={this.updateData.bind(this)}>
                <SaveIcon className={classes.buttonIcon} />
                Save
              </Button>
            </div>
          </form>
        </div>
      
    )
  }
}



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