const { spawn } = require("child_process");
const debug = require("debug")("tsgen-api");

const STATE_STARTING = 'starting';
const STATE_RUNNING = 'running';
const STATE_IDLE = 'idle';
const STATE_STOPPING = 'stopping';

const TYPE_TESTSRC_1080p25 = 'testsrc1080p25';
const TYPE_TESTSRC_720p25 = 'testsrc720p25';

let availableStreams = {};

function setupStreams(num) {
  for (let i = 0; i < num; i++) {
    let id = i + 1;
    availableStreams[id] = {
      id: id,
      destAddress: '239.0.0.1',
      destPort: 1230 + i,
      audioStreams: 1,
      channels: 2,
      type: TYPE_TESTSRC_1080p25,
      state: STATE_IDLE
    };
  }
}

async function listStreams() {
  let streams = [];

  Object.keys(availableStreams).forEach(id => {
    streams.push(getStatusForStream(id));
  });

  return streams;
}

async function startStream(id, destAddress, destPort, audioStreams, channels, type) {
  if (!availableStreams[id]) {
    throw new Error("Invalid stream ID");
  }
  if (availableStreams[id] && availableStreams[id].process) {
    throw new Error("Stream is already running. Needs to stop it first");
  }

  availableStreams[id] = {
    id: id,
    destAddress: destAddress,
    destPort: destPort,
    audioStreams: audioStreams,
    channels: channels,
    type: type,
    state: STATE_STARTING
  };
  
  let inputSrc;
  if (type === TYPE_TESTSRC_1080p25) {
    inputSrc = [ '-re', '-fflags', '+genpts', '-f', 'lavfi', '-i', 'testsrc=duration=3600:size=1920x1080:rate=25' ];
  } else if (type === TYPE_TESTSRC_720p25) {
    inputSrc = [ '-re', '-fflags', '+genpts', '-f', 'lavfi', '-i', 'testsrc=duration=3600:size=1280x720:rate=25' ];
  }

  const child = spawn('ffmpeg', 
      inputSrc.concat([
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-pix_fmt', 'yuv420p',
      '-an',
      '-f', 'mpegts',
      `udp://${destAddress}:${destPort}?pkt_size=1316`
    ]));
  availableStreams[id].process = child;
  availableStreams[id].state = STATE_RUNNING;

  availableStreams[id].process.stdout.on('data', data => {
    debug(`${id}: ${data}`);
  });
  availableStreams[id].process.stderr.on('data', data => {
    debug(`${id}: ${data}`);
  });
  availableStreams[id].process.on('exit', code => {
    debug(`${id}: Exit code is ${code}`);
    debug(availableStreams[id].process.spawnargs);
    availableStreams[id].state = STATE_IDLE;
    availableStreams[id].process = undefined;
  });

  return getStatusForStream(id); 
}

function getStatusForStream(id) {
  return {
    id: availableStreams[id].id,
    destAddress: availableStreams[id].destAddress,
    destPort: availableStreams[id].destPort,
    audioStreams: availableStreams[id].audioStreams,
    channels: availableStreams[id].channels,
    type: availableStreams[id].type,
    state: availableStreams[id].state
  };
}

module.exports = {
  setupStreams,
  listStreams,
  startStream,
  getStatusForStream
}