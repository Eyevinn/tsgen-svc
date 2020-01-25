import Container from 'react-bootstrap/Container';
import BaseAPI from './BaseAPI';
import Stream from './Stream';

export default class Streams extends BaseAPI {
  constructor() {
    super();

    this.state = {
      streams: []
    };
  }

  componentDidMount() {
    this.getAvailableStreams().then(streams => {
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