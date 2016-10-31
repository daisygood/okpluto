'user strict'

import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyTheme from '../theme/theme.js';
import Drawer from 'material-ui/Drawer'
import { findUser } from '../services/userServices.js'
import Loading from './loading.jsx'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import MenuItem from 'material-ui/MenuItem';
import Person from 'material-ui/svg-icons/social/person';
import EventNote from 'material-ui/svg-icons/notification/event-note';
import UserEvent from 'material-ui/svg-icons/social/group';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { hashHistory } from 'react-router'

class InfoDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      profileOpen: false
    }
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.resetUserInfo = this.resetUserInfo.bind(this)
  }

  componentWillMount() {
    var self = this;
    findUser()
    .then(user => {
      if (!user) self.resetUserInfo();
      self.setState({info: user});
    })
  }

  // Reset user info with changes
  resetUserInfo() {
    var self = this;
    findUser()
    .then(user => {
      self.setState({info: user});
    })
  }

  // Toggle info drawer
  toggleDrawer() {
    this.setState({'open': !this.state.open});
    this.setState({'profileOpen': false})
  }

  // Redirect page to match the button clicked
  reRoute(route) {
    this.toggleDrawer();
    hashHistory.push(route)
  }

  render() {
    const iconStyle = {
      float: 'right',
      rightIcon: {
        textAlign: 'center',
        lineHeight: '24px'
      }
    }

    if(this.state.info) {
      let children = null;
      if (this.props.children) {
        // pass auth, userInfo, toggleDrawer function and resetUserInfo function to all child components
        children = React.cloneElement(this.props.children, {
          auth: this.props.auth,
          userInfo: this.state.info,
          toggleDrawer: this.toggleDrawer,
          resetUserInfo: this.resetUserInfo
        })
      }

      return (
        <div>
          <MuiThemeProvider muiTheme={getMuiTheme(MyTheme)}>
            <Drawer width={250} open={this.state.open}>

              <div style={iconStyle} >
                <IconButton onTouchTap={this.toggleDrawer}>
                  <NavigationClose />
                </IconButton>
              </div>
              <h3 style={{marginLeft: 15}}> Menu </h3>

              <Divider />

              <MenuItem onTouchTap={() => this.reRoute('/events')} rightIcon={<EventNote color='#488985' />}> View Events </MenuItem>
              <MenuItem onTouchTap={() => this.reRoute('/users')} rightIcon={<Person color='#488985'/>}> View Users </MenuItem>
              <Divider />

              <MenuItem onTouchTap={() => this.reRoute('/profile')} rightIcon={<Avatar src={this.state.info.profilepic} size={30}/>}> Your Profile </MenuItem>

            </Drawer>
          </MuiThemeProvider>
          <div>
            {children}
          </div>
        </div>
      )
    } else {
      return (
        <Loading />
      )
    }
  }
}

module.exports = InfoDrawer
