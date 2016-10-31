/*
  This file contains the homepage footer! A few links to our github page if users are interested. Pretty simple. Note that there's a different footer component to be shown after users log in within footer-loggedIn.jsx (although you've probably already seen it).
*/

"use strict";

import React from 'react';

const Footer = (props) => (
  <footer className="primary-footer">
    <small>&copy; Ok Pluto</small>
    <nav className="nav">
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="https://github.com/okpluto/okpluto/blob/master/_PRESS-RELEASE.md">Why choose OK Pluto</a></li>
        <li><a href="https://github.com/okpluto/okpluto/blob/master/README.md">About Us</a></li>
      </ul>
    </nav>
  </footer>
)

module.exports = Footer;