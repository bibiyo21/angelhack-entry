import React, { Component } from 'react';
import './App.css';
import { Container, Button } from 'react-bootstrap';
import location from "geolocation"

import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends Component {
  constructor(props) {
    super(props);
    location.getCurrentPosition( (err, position) =>  {
      this.state.location = position
    });

    this.state = {status :''};
    
    this.notifyHospitals = this.notifyHospitals.bind(this)
  }
  
  CreateIncident = `
  mutation($location: String!, $status: String, $reporter: String, $rescuer: String, $date_reported: String) {
    CreateIncident(input: {
      location: $location
      status: $status
      reporter: $reporter
      rescuer: $rescuer
      date_reported: $date_reported
    }) {
      location status reporter rescuer date_reported
    }
  }`

  signOut() {
    Auth.signOut();
  }

  notifyHospitals() {
    console.log('date reported', new Date())
    console.log('current lat', this.state.location.coords.latitude)
    console.log('current long', this.state.location.coords.longitude)
    console.log(this.props)
    
    this.setState({
      status: 'Waiting for a rescuer...'
    })
    // this.props.status = 'wewe'
    // console.log(this.props.status)
  }

  render() {
    return (
      <div className="main-container">
        <Container className="form-signin">
          <div className="text-center mb-4">
            <Button variant="warning" size="lg" onClick={this.notifyHospitals}>There is an Accident!</Button>
            <h5>{this.state.status}</h5>
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
