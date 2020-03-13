import React from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "./StartButton";
import Row from "react-bootstrap/Row";
import BaseAPI from "../../lib/ui_api";
import TextInput from "./TextInput";

const TEST_SOURCES = [
  {
    id: "testsrc1080p25",
    description: "1080p25/AVC (tc,pts)"
  },
  {
    id: "testsrc720p25",
    description: "720p25/AVC (tc,pts)"
  }
];

export default class Stream extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      stream: {}
    };
    this.api = new BaseAPI();
  }

  componentDidMount() {
    const id = this.props.streamId;
    if (id) {
      this.api.getStreamById(id).then(stream => {
        this.setState({ stream: stream });
      });
    }
  }

  handleChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let newStream = this.state.stream;
    newStream[name] = value;
    this.setState({ stream: newStream });
  };

  handleStart = async () => {
    const newStream = await this.api.startStream(this.state.stream);
    this.setState({ stream: newStream });
  };

  handleStop = async () => {
    this.setState({ loading: true });
    const newStream = await this.api.stopStream(this.state.stream);
    this.setState({ stream: newStream, loading: false });
  };

  render() {
    const stream = this.state.stream;
    return (
      <Form className="justify-content-md-center">
        {stream ? (
          <div className="form-wrapper">
            <Row className="status-wrapper">
              <Col xs={3} sm={2} xl={1}>
                ID: <span>{stream.id}</span>
              </Col>
              <Col>
                Status:{" "}
                <span
                  className={
                    "stream-status " +
                    (stream.state === "running" ? "running" : "")
                  }
                >
                  {stream.state}
                </span>
              </Col>
            </Row>

            <Form.Row>
              <TextInput
                name="destAddress"
                stream={stream}
                handleChange={this.handleChange}
                label="Destination Address"
              />
            </Form.Row>

            <Form.Row>
              <TextInput
                name="destPort"
                stream={stream}
                handleChange={this.handleChange}
                label="Destination Port"
              />
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} sm={12} controlId={"streamType" + stream.id}>
                <Form.Label>Test Source</Form.Label>
                <Form.Control
                  as="select"
                  onChange={this.handleChange}
                  name="type"
                >
                  {TEST_SOURCES.map((src, idx) => {
                    return (
                      <option key={idx} value={src.id}>
                        {src.description}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <TextInput
                name="audioStreams"
                stream={stream}
                handleChange={this.handleChange}
                label="Audio Tracks"
              />
              <TextInput
                name="channels"
                stream={stream}
                handleChange={this.handleChange}
                label="Audio Channels (per track)"
              />
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} sm={6} controlId={"action" + stream.id}>
                {stream.state === "idle" ? (
                  <Button
                    loading={this.state.loading}
                    handleClick={this.handleStart}
                    variant="success"
                  />
                ) : (
                  <Button
                    variant="danger"
                    handleClick={this.handleStop}
                    loading={this.state.loading}
                  />
                )}
              </Form.Group>
            </Form.Row>
          </div>
        ) : null}
      </Form>
    );
  }
}
