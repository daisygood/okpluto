/*
  This file contains the component for the DialogButton! Used within user.jsx
*/

import React from 'react'
import MeetupDialog from './meetupDialog.jsx'

class DialogButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MeetupDialog userId={this.props.userId} lat={this.props.lat} lng={this.props.lng} userInfo={this.props.userInfo} resetUserInfo={this.props.resetUserInfo}
      />
    )
  }
}

module.exports = DialogButton;