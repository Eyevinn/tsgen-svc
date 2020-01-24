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

  let drawtext = [ '-vf', 'drawtext=fontfile=/usr/share/fonts/truetype/freefont/FreeSansBold.ttf:fontsize=82:fontcolor=white:timecode=\'00\\:00\\:00\\:00\':timecode_rate=25:x=(w-text_w)/2:y=(h-text_h)/2'];
  let audioInputs = [];
  for (let i = 0; i < audioStreams * channels; i++) {
    audioInputs = audioInputs.concat([ '-f', 'lavfi', '-i', 'sine=frequency=440:beep_factor=4']);    
  }
  let audioMix = [];
  let audioMap = [];
  let inputNum = 0;
  for (let i = 0; i < audioStreams; i++) {
    let join = "";
    for (let j = 0; j < channels; j++) {
      join += `[${1 + inputNum + j}:a]`;
    }
    join += `join=inputs=${channels}`;
    if (channels > 1) {
      audioMix = audioMix.concat(['-filter_complex', join + `[a${i}]`]);
      audioMap = audioMap.concat(['-map', `[a${i}]`]);
    } else {
      audioMix = [];
      audioMap = audioMap.concat(['-map', `${i+1}:a`]);
    }
    inputNum += channels;
  }

  let streams = [];
  if (type === TYPE_TESTSRC_1080p25) {
    streams = [ '-re', '-fflags', '+genpts', '-f', 'lavfi', '-i', 'smptehdbars=size=1920x1080:rate=25' ]
    .concat(audioInputs).concat(drawtext).concat(audioMix).concat(["-map", "0:v"]).concat(audioMap);
  } else if (type === TYPE_TESTSRC_720p25) {
    streams = [ '-re', '-fflags', '+genpts', '-f', 'lavfi', '-i', 'smptehdbars=size=1280x720:rate=25' ]
    .concat(audioInputs).concat(drawtext).concat(audioMix).concat(["-map", "0:v"]).concat(audioMap);
  }

  const child = spawn('ffmpeg', 
      streams.concat([
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-pix_fmt', 'yuv420p',
      '-f', 'mpegts',
      `udp://${destAddress}:${destPort}?pkt_size=1316`
    ]));
  debug(child.spawnargs);
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