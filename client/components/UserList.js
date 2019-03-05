import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TextField from '@material-ui/core/TextField';

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


class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsername: '',
      error: null
    }
  }
  
  addUser(username) {
    const { data, mutate } = this.props;
		mutate({
      variables: { username }
    })
    .then(({ data }) => {
      const { error } = data.addUser;
      if(error) this.displayError(error);
    })
    .then(() => data.refetch());
  }
  
  displayError(error) {
    const { code } = error;
    if(code === 11000) {
      this.setState({ error: "Username taken" });
      setTimeout(() => this.setState({ error: null }), 1500);
    }
  }
  
  handleChange(e, name) {
    this.setState({ [name]: e.target.value });
  };
  
  hanldeKeyPress(e) {
    if (e.which === 13) {
      this.addUser(this.state.newUsername);
      this.setState({ newUsername: ''});
      e.target.blur()
    }
  }
  
  renderListItem(user) {
    const { id, username } = user;
    return (
      <Link key={id} to={`user/${id}/exercises`}>
        <ListItem button>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={username} />
        </ListItem>
      </Link>
    );
  }
  
  render() {
    const { classes, data } = this.props;
    const { error } = this.state;
    
    return (
      <div className={classes.root}>
        <List component="nav">
          <ListItem>
            <TextField
              error={error && true}
              disabled={error && true}
              label={error || "Add User"}
              value={error ? "" : this.state.newUsername}
              onChange={e => this.handleChange(e, "newUsername")}
              onKeyPress={this.hanldeKeyPress.bind(this)}
              className={classNames(classes.textField)}
            />
          </ListItem>
          { data.users && data.users.map(user => this.renderListItem(user)) }
        </List>
      </div>
    );
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mutation = gql`
  mutation AddUser($username: String!) {
    addUser(username: $username) {
      id
      username
      error {
        code
      }
    }
  }
`


const query = gql`
  {
    users {
      id
      username
    }
  }
`

export default graphql(mutation)(graphql(query)(withStyles(styles)(UserList)))