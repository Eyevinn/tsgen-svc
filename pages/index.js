import Head from 'next/head';
import Streams from './components/Streams';

const App = () => (
  <div>
    <Head>
      <title>Eyevinn Transport Stream Generator</title>
      <link rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />
    </Head>
    <div className="header">
      <h1>Eyevinn Transport Stream Generator</h1>
      <p>Generate an MPEG-TS source and stream to a unicast or multicast address.</p>
    </div>
    <Streams />
  </div>
);

export default App;