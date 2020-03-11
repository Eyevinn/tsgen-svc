import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const TextInput = ({ name, label, stream, handleChange }) => {
  return (
    <Form.Group
      as={Col}
      sm={12}
      lg={name.includes("audio") ? 6 : 12}
      controlId={name + stream.id}
    >
      <Form.Label>{label}</Form.Label>
      <Form.Control value={stream[name]} onChange={handleChange} name={name} />
    </Form.Group>
  );
};

export default TextInput;
