import React from "react";
import BaseAPI from "../../lib/ui_api";
import Stream from "./Stream";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default class Streams extends React.Component {
  constructor() {
    super();

    this.state = {
      availableStreams: [],
      streams: []
    };

    this.api = new BaseAPI();
  }

  addNew = () => {
    if (this.state.availableStreams.length > 0) {
      const nextStream = this.state.availableStreams.shift();
      this.setState({ streams: [...this.state.streams, nextStream] });
    }
  };

  componentDidMount() {
    this.api.getAvailableStreams().then(streams => {
      const firstStream = streams.shift();
      this.setState({
        availableStreams: streams,
        streams: [...this.state.streams, firstStream]
      });
    });
  }

  render() {
    return (
      <div className="streams-wrapper">
        {this.state.streams.map((stream, index) => {
          return (
            <Stream
              key={index}
              apiBaseUrl={this.apiBaseUrl}
              streamId={stream.id}
            />
          );
        })}
        {this.state.availableStreams.length > 0 && (
          <div className="add-new text-right">
            <Button variant="add" onClick={this.addNew}>
              Add new
            </Button>
          </div>
        )}
      </div>
    );
  }
}
