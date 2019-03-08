import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import MomentUtils from '@date-io/moment';
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
      selectedDate: new Date(),
      duration: 0,
      description: ''
    }
  }
  
  handleChange(e, name) {
    this.setState({ [name]: e.target.value });
  };
  
  handleDateChange(date) {
    this.setState({ selectedDate: date });
  };
  
  render() {
    const { classes, history } = this.props;
    const { error, selectedDate } = this.state;
    
    
    return (
      
        <div className={classes.root}>
          <Button onClick={history.goBack}>
            Go Back
          </Button>
          <form className={classes.container} noValidate autoComplete="off">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                margin="normal"
                label="Date picker"
                value={selectedDate}
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
              value={this.state.name}
              onChange={e => this.handleChange(e, 'name')}
              margin="normal"
              variant="outlined"
            />
          </form>
        </div>
      
    )
  }
}

ExerciseDetail.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(ExerciseDetail)