"use strict";

// Renders button to edit profile
// keeps user info in state
// passes function to profileEdit that
// updates user info in state as the user types

import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MyTheme from '../theme/theme.js';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { updateUser } from '../services/userServices.js';
import { hashHistory } from 'react-router';
import ProfileEdit from './profileEdit.jsx';


const rValidImage = /^((https?|ftp):)?\/\/.*(jpeg|jpg|png|gif|bmp)$/i

const isValidImage = function(url) {
  return url.match(rValidImage)
};


// Validates user info
const validate = values => {
  const errors = {}
  const requiredFields = [ 'firstname', 'lastname', 'loc', 'dogname', 'dogBreed', 'dogAge', 'picLink' ]
  requiredFields.forEach(field => {
    if (!values[field].value) {
      errors[field] = 'Required'
    }
  })
  if (isNaN(parseInt(values.dogAge.value))) {
    errors.dogAge = 'Please enter a number'
  }
  if (!isValidImage(values.picLink.value)) {
    errors.picLink = 'Invalid Url'
  }
  return errors
}

class ProfileEditDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: this.props.userInfo,
      errorText: {},
      open: false
    };
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
// Passed to ProfileEdit.jsx, allows user input to
// change user info in state of this component
  handleChange(newUser) {
    this.setState({'user': newUser});
  }

// Checks for errors, saves new info into data base
// Calls resetUserInfo from infoDrawer component
// so info on page updates immediately after a change
// without needing to refresh page
  handleSubmit() {
    var self = this;
    let errors = validate(profile);
    let handleClose = this.handleClose;
    if (Object.keys(errors).length === 0) {
      updateUser(self.state.user)
        .then(function (user) {
        handleClose();
        self.props.resetUserInfo();
      });
    }
    this.setState({"errorText": errors});
  }

// Functions to open and close the edit dialog box
  handleOpen() {
    this.setState({open: true})
  };

  handleClose() {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit}
      />
    ]

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(MyTheme)}>
        <div>
          <div className="profile-edit">
          <RaisedButton onTouchTap={this.handleOpen} label="Edit Profile" primary={true}/>
          </div>
          <Dialog style={{zIndex: 2100}} title="Edit Profile" modal={true} actions={actions} open={this.state.open} onRequestClose={this.handleClose} autoScrollBodyContent={true} autoDetectWindowHeight={true} >

            <div className="middle">
            <form name="profile">
              <ProfileEdit profile={this.state.user} error={this.state.errorText} change={this.handleChange} />
            </form>
          </div>

          </Dialog>
        </div>
      </MuiThemeProvider>
    )
  }
}

module.exports = ProfileEditDialog;