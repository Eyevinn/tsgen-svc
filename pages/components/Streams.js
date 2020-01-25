import React from 'react';
import Container from 'react-bootstrap/Container';
import BaseAPI from '../../lib/ui_api';
import Stream from './Stream';

export default class Streams extends React.Component {
  constructor() {
    super();

    this.state = {
      streams: []
    };

    this.api = new BaseAPI();
  }

  componentDidMount() {
    this.api.getAvailableStreams().then(streams => {
      this.setState({ streams: streams });
    });
  }

  render() {
    return (
      <Container>
        {this.state.streams.map((stream, index) => {
          return <Stream key={index} apiBaseUrl={this.apiBaseUrl} streamId={stream.id} />
        })}
      </Container>
    )
  }
}