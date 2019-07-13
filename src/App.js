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

    this.state = {
      status :'',
      places : [],
      nearByLabel: ''
    };
    
    this.notifyHospitals = this.notifyHospitals.bind(this);
  }

  signOut() {
    Auth.signOut();
  }

  notifyHospitals = async() => {
    let lat = this.state.location.coords.latitude;
    let long = this.state.location.coords.longitude;
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
      location : JSON.stringify({lat: lat, long: long}),
      reporter : 'bibiyo',
      rescuer: 'none',
      date_reported: new Date().toString(),
      status: 'pending'
    }

    await API.graphql(graphqlOperation(CreateIncident, incident))

    await API.get('usirestapi', '/places').then(response => {
      this.setState({
        status: 'Waiting for a rescuer...',
        places: response.success,
        nearByLabel: 'Hospital Nearby'
      })
    });

    
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
        <Container className="form-signin py-5">
          <div className="text-center mb-4">
            <Button variant="warning" size="lg" onClick={this.notifyHospitals}>
              <strong>
              There is an Accident!
              </strong>
            </Button>
            <h5 className="py-2">{this.state.status}</h5>
            <strong>{this.state.nearByLabel}</strong>
            <ul className="list-unstyled text-justify">
              {
                this.state.places.map( (data,index) => 
                  (<li key={index}><i className="spinner-grow text-primary"></i> {data}</li>)
                )
              }
            </ul>
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
