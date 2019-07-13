import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Button, Col, Row } from 'react-bootstrap';

import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends Component {

  signOut() {
    Auth.signOut();
  }

  notifyHospital() {
    console.log(this.state.status)
  }

  render() {
    return (
      <div className="main-container">
        <Container className="form-signin">
          <div class="text-center mb-4">
            <Button variant="warning" size="lg" onClick={this.notifyHospital}>There is an Accident!</Button>
            {this.state.status}
          </div>
          <div className="logout-btn position-absolute mb-4" >
            <Button variant="light" onClick={this.signOut}> Logout</Button>
          </div>
        </Container>
        
        
      </div>
    );
  }
}

export default withAuthenticator(App);
