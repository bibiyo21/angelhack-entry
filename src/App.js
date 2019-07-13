import React, { Component } from 'react';
import './App.css';
import { Container, Button, Table } from 'react-bootstrap';
import location from "geolocation"

import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { async } from 'q';
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

  signOut() {
    Auth.signOut();
  }

  notifyHospitals = async() => {
    const CreateIncident = `
      mutation($location: String!, $status: String, $reporter: String, $rescuer: String, $date_reported: String) {
        createIncident(input: {
          location: $location
          status: $status
          reporter: $reporter
          rescuer: $rescuer
          date_reported: $date_reported
        }) {
          location status reporter rescuer date_reported
        }
      }`;

    const incident = {
      location : JSON.stringify({lat: this.state.location.coords.latitude, long: this.state.location.coords.longitude}),
      reporter : 'bibiyo',
      rescuer: 'none',
      date_reported: new Date().toString(),
      status: 'pending'
    }

    await API.graphql(graphqlOperation(CreateIncident, incident))
    
    this.setState({
      status: 'Waiting for a rescuer...'
    })
  }

  async componentDidMount() {
    const ListIncidents = `
      query {
        listIncidents {
          items {
            id location status reporter rescuer date_reported
          }
        }
      }`
    try {
      const incidents = await API.graphql(graphqlOperation(ListIncidents))
      console.log('Incidents: ', incidents)
      this.setState({ incidents: incidents.data.listIncidents.items })
    } catch (err) {
      console.log('error fetching data: ', err)
    }
  }

  render() {
    return (
      <div className="main-container">
        <Container className="form-signin">
          <div className="text-center mb-4">
            <Button variant="warning" size="lg" onClick={this.notifyHospitals}>There is an Accident!</Button>
            <h5>{this.state.status}</h5>

            <Table>
            </Table>
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
