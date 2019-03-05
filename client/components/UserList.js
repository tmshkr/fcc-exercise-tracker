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

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsername: ''
    }
  }
  
  addUser(username) {
    const { data, mutate } = this.props;
		mutate({
      variables: {
        username
      }
    })
    .then(() => data.refetch());
  }
  
  handleChange(e, name) {
    this.setState({ [name]: e.target.value });
  };
  
  hanldeKeyPress(e) {
    if (e.which === 13) {
      this.addUser(this.state.newUsername);
      this.setState({ newUsername: ''});
    }
  }
  
  renderListItem(user) {
    const { id, username } = user;
    return (
      <ListItem button key={id}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary={username} />
      </ListItem>
    );
  }
  
  render() {
    const { classes, data, error } = this.props;
    
    if(error) console.log(error);

    return (
      <div className={classes.root}>
        <List component="nav">
          <ListItem>
            <TextField
              label="Add User"
              value={this.state.newUsername}
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
    }
  }
`;


const query = gql`
  {
    users {
      id
      username
    }
  }
`

export default graphql(mutation)(graphql(query)(withStyles(styles)(UserList)))