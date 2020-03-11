import Head from "next/head";
import Streams from "./components/Streams";
import Image from "react-bootstrap/Image";
import Logo from "../images/eyevinn.png";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const App = () => (
  <div className="body">
    <Head>
      <title>Eyevinn Transport Stream Generator</title>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />
      <link rel="icon" href={Logo}></link>
    </Head>
    <Container>
      <Row className="justify-content-center align-items-center text-md-left text-center">
        <Col xs={2} md={2} lg={1}>
          <div className="logo-wrapper">
            <Image src={Logo} className="logo" />
          </div>
        </Col>
        <Col xs={12} md={7} lg={6} xl={5}>
          <h1>Eyevinn Transport Stream Generator</h1>
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center text-center">
        <Col>
          <p>
            Generate an MPEG-TS source and stream to a unicast or multicast
            address.
          </p>
        </Col>
      </Row>

      <Streams />
    </Container>
  </div>
);

export default App;
