"use strict";

import  UserList from './userList.jsx';
import { getUsers } from '../services/userServices.js'
import NavLoggedIn from './nav-loggedIn.jsx';
import React, { PropTypes as T } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import MyTheme from '../theme/theme.js';
import { getDistance } from '../services/distanceServices';
import Banner from './banner.jsx';
import FooterLoggedIn from './footer-loggedIn.jsx';

class UsersPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      search: '',
      displayedUsers: [],
      searchSource: []
    };
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    var self = this;
    getUsers()
    .then((users) => {
      var userDests = [];
      var tracker = 0;

      //Don't display current user
      users.users = users.users.filter((user) => {
        return user._id !== this.props.userInfo._id;
      });

      // Set searchable options
      var searchArray = [];
      users.users.forEach(user => {
        searchArray.push(user.firstname + ' ' + user.lastname, user.dogname)
      })
      self.setState({searchSource: searchArray});

      //tracker for matching distance to user
      users.users.forEach(user => {
        if(user.lat && user.lng) {
          user.tracker = tracker;
          tracker++;
          userDests.push({lat: user.lat, lng: user.lng})
        }
      });

      //Find distance btwn current user and each other user
      getDistance({lat: this.props.userInfo.lat, lng: this.props.userInfo.lng}, userDests)
      .then(distances => {
        console.log(distances)
        users.users.forEach(user => {
          if (user.tracker !== undefined && distances[user.tracker].status === "OK") {
            user.distance = Number(distances[user.tracker].distance.value)
          }
        })
        //Sort by distance
        var noDistInfo = [];
        var usersDistInfo = []
        users.users.forEach(user => {
          if (user.distance === undefined) {
            noDistInfo.push(user)
          } else {
            usersDistInfo.push(user)
          }
        });
        usersDistInfo.sort((a, b) => {
          return a.distance < b.distance ? -1 : 1
        })
        let sortedUsers = usersDistInfo.concat(noDistInfo)

      //let sortedUsers = users.users
        //Set users to display after getting distance info
        self.setState({users: sortedUsers})
        self.setState({displayedUsers: sortedUsers})
      // })
    })
  }

  handleChange(text, userNames) {
    // Change displayedUsers array based on the search input
    var displayedUsers = this.state.users.filter(user => {
      if (user.dogname === undefined) user.dogname = '';
      var re = new RegExp(text, "gi")
      var name = user.firstname + ' ' + user.lastname;
      return name.match(re) || user.dogname.match(re)
    })
    this.setState({displayedUsers: displayedUsers});
  }

  render () {
    return (
      <div>
        <NavLoggedIn auth={this.props.auth} toggleDrawer={this.props.toggleDrawer}/>
        <Banner display={'Local Users'} />
        <div style={{marginBottom: 20}}>

          <MuiThemeProvider muiTheme={getMuiTheme(MyTheme)}>
             <AutoComplete style={{marginLeft: '75%'}}
               floatingLabelText="Search Users"
               filter={AutoComplete.fuzzyFilter}
               dataSource={this.state.searchSource}
               maxSearchResults={5}
               searchText={this.state.search}
               onUpdateInput={this.handleChange}
               onNewRequest={this.handleChange}
             />
          </MuiThemeProvider>

          <MuiThemeProvider muiTheme={getMuiTheme(MyTheme)}>
              <UserList
                users={this.state.displayedUsers}
                userInfo={this.props.userInfo}
                resetUserInfo={this.props.resetUserInfo}
              />
          </MuiThemeProvider>

        </div>
        <FooterLoggedIn />
      </div>
    )
  }

}

module.exports = UsersPage;
