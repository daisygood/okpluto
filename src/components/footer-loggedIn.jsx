/*
  This file contains the footer users see after they log in! Using hashHistory, it redirects users to the corresponding description given for the page (Users, Events, or Profile). Note that there's a different footer component to be shown on the home page within footer.jsx (right below this one).
*/

"use strict";

import React from 'react';
import { hashHistory } from 'react-router';

const FooterLoggedIn = (props) => (
  <footer className="primary-footer">
    <small>&copy; Ok Pluto</small>
    <nav className="nav">
      <ul>
        <li><a onClick={() => hashHistory.push('/users')}>Users</a></li>
        <li><a onClick={() => hashHistory.push('/events')}>Events</a></li>
        <li><a onClick={() => hashHistory.push('/profile')}>Profile</a></li>
      </ul>
    </nav>
  </footer>
)

module.exports = FooterLoggedIn;