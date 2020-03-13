import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

const StartButton = ({ variant, handleClick, loading }) => {
  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={loading ? "loading-state" : ""}
    >
      {loading && (
        <Spinner animation="border" role="status" as="span">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      <span>{variant === "danger" ? "Stop" : "Start"}</span>
    </Button>
  );
};

export default StartButton;
