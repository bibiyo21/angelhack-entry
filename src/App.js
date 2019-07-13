import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Button, Col, Row } from 'react-bootstrap';

import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends Component {
  constructor(props) {
    super(props);
    // this.props.status = '';
    this.notifyHospital = this.notifyHospital.bind(this);
  }

  signOut() {
    Auth.signOut();
  }

  notifyHospital() {
    // this.props.status = 'wewe'
    // console.log(this.props.status)
  }

  render() {
    return (
      <div className="main-container">
        <Container className="form-signin">
          <div className="text-center mb-4">
            <Button variant="warning" size="lg" onClick={this.notifyHospital}>There is an Accident!</Button>
            {/* {this.state.status} */}
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
