// eslint-disable
// this is an auto generated file. This will be overwritten

export const getIncident = `query GetIncident($id: ID!) {
  getIncident(id: $id) {
    id
    location
    status
    reporter
    rescuer
    date_reported
  }
}
`;
export const listIncidents = `query ListIncidents(
  $filter: ModelIncidentFilterInput
  $limit: Int
  $nextToken: String
) {
  listIncidents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      location
      status
      reporter
      rescuer
      date_reported
    }
    nextToken
  }
}
`;
