 "use strict";

// This shows the first time a user signs in
// It steps through the sign up process
// to get user's profile info


import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MyTheme from '../theme/theme.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import { findUser, updateUser } from '../services/userServices.js';
import { hashHistory } from 'react-router';

const rValidImage = /^((https?|ftp):)?\/\/.*(jpeg|jpg|png|gif|bmp)$/i

const isValidImage = function(url) {
  return url.match(rValidImage)
};

// Validation function for each step of signup process
// Values param is the form name currently being validated
// Step 0 is user profile, step 1 is dog profile
const validate = (values, step) => {
  const errors = {};
  var requiredFields = [];
  const fields = [ 'firstname', 'lastname', 'loc', 'dogname', 'dogBreed', 'dogAge', 'picLink' ];
  if (step === 0) {
    requiredFields = fields.slice(0, 3);
    requiredFields.forEach(field => {
      if (!values[field].value) {
      errors[field] = 'Required'
      }
    })
  } else {
    requiredFields = fields.slice(3);
    requiredFields.forEach(field => {
    if (!values[field].value) {
      errors[field] = 'Required';
    }
    })
    if (isNaN(parseInt(values.dogAge.value))) {
      errors.dogAge = 'Please enter a number'
    }
    if (!isValidImage(values.picLink.value)) {
      errors.picLink = 'Invalid Url'
    }
  }

  return errors
}



class ProfileCreation extends React.Component {

// Keeps all user info in state
  constructor(props) {
    super(props)
    this.state = {
      finished: false,
      stepIndex: 0,
      firstname: "",
      lastname: "",
      loc: "",
      dogname: "",
      dogBreed: "",
      dogAge: "",
      picLink:"",
      errorText: {}
    }
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }

// Waits until new user info is saved to DataBase, then pulls
// available info to pre-populate sign up form
// Currently only first and last name are available
// On every sign up
  componentDidMount() {
    setTimeout(() => {
      // User services function, searches by user ID
      findUser()
      .then((user) => {
        this.setState({"firstname": user.firstname});
        this.setState({"lastname": user.lastname})
        this.setState({"loc": user.loc || ""});
        this.setState({"dogname": user.dogname || ""});
        this.setState({"dogBreed": user.dogBreed || ""});
        this.setState({"dogAge": user.dogAge || ""});
        this.setState({"picLink": user.picLink || ""});
      })
    }, 1000)
  }

// Updates State to match user input
  handleChange(prop, event) {
    let change = {};
    change[prop] = event.target.value
    this.setState(change);
  }

// Does error checking on form iput, and either displays error message,
// or updates user in DB and redirects to users page after step 1 is complete
  handleSubmit() {
    var errors = {};
    if (this.state.stepIndex === 1) {
      errors = validate(dogProfile, 1);
    } else {
      errors = validate(ownerProfile, 0);
    }
    if (Object.keys(errors).length === 0) {
      this.handleNext();
      if (this.state.stepIndex === 1) {

        updateUser(this.state)
          .then(function (user) {
            hashHistory.push('/users')
        });
      }
    }
    this.setState({"errorText": errors});
    console.log(this.state);
  }

// Steps to next part of sign up form
  handleNext() {
    var self = this;
    this.setState({
      stepIndex: self.state.stepIndex + 1,
      finished: self.state.stepIndex >= 1,
    });
  }

// Goes backwards on sign up form
  handlePrev(){
    var self = this;
    if (this.state.stepIndex > 0) {
      this.setState({stepIndex: self.state.stepIndex - 1});
    }
  }

// Material ui - info for step form with 2 steps (user info and dog info)
  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <form name="ownerProfile">
            <TextField
              hintText="First Name"
              floatingLabelText="First Name"
              value = {this.state.firstname}
              onChange = {this.handleChange.bind(this, 'firstname')}
              name = "firstname"
              errorText = {this.state.errorText.firstname}
            /><br />
            <TextField
              hintText="Last Name"
              floatingLabelText="Last Name"
              value = {this.state.lastname}
              onChange = {this.handleChange.bind(this, 'lastname')}
              name = "lastname"
              errorText = {this.state.errorText.lastname}
            /><br />
            <TextField
              hintText="Location"
              floatingLabelText="Location"
              value = {this.state.loc}
              onChange = {this.handleChange.bind(this, 'loc')}
              name = "loc"
              errorText = {this.state.errorText.loc}
            /><br />
          </form>
        )
      case 1:
        return (
          <form name="dogProfile">
            <TextField
              hintText="Dog Name"
              floatingLabelText="Dog Name"
              value = {this.state.dogname}
              onChange = {this.handleChange.bind(this, 'dogname')}
              name = "dogname"
              errorText = {this.state.errorText.dogname}
            /><br />
            <TextField
              hintText="Dog Breed"
              floatingLabelText="Dog Breed"
              value = {this.state.dogBreed}
              onChange = {this.handleChange.bind(this, 'dogBreed')}
              name = "dogBreed"
              errorText = {this.state.errorText.dogBreed}
            /><br />
            <TextField
              hintText="Dog Age"
              floatingLabelText="Dog Age"
              value = {this.state.dogAge}
              onChange = {this.handleChange.bind(this, 'dogAge')}
              name = "dogAge"
              errorText = {this.state.errorText.dogAge}
            /><br />
            <TextField
              hintText="Dog Profile Pic"
              floatingLabelText="Dog Profile Pic"
              value = {this.state.picLink}
              onChange = {this.handleChange.bind(this, 'picLink')}
              name = "picLink"
              errorText = {this.state.errorText.picLink}
            /><br />
          </form>
      )
      default:
        return '';
    }
  }

// Renders current step of form, or blank if form is complete
// and user is being redirected
  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(MyTheme)}>
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Tell us more about you</StepLabel>
          </Step>
          <Step>
            <StepLabel>Tell us more about your best friend</StepLabel>
          </Step>
        </Stepper>
        <div >
          {finished ? ("") : (
            <div>
              <div className = "middle">{this.getStepContent(stepIndex)}</div>
              <div className ="middle" style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onTouchTap={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 2 ? 'Finish' : 'Next'}
                  secondary={true}
                  onTouchTap={()=>{
                    this.handleSubmit();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}

module.exports = ProfileCreation