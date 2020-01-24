const Restify = require("restify");
const errs = require("restify-errors");
const SwaggerUI = require("swagger-ui-restify");

const debug = require("debug")("tsgen-svc");

const api = require("./lib/api.js");

const wrap = function(fn) {
  return function(req, res, next) {
      return fn(req, res, next).catch(function(err) {
          return next(err);
      });
  };
};

let server = Restify.createServer();
server.use(Restify.plugins.queryParser());
server.use(Restify.plugins.bodyParser());

// API Documentation
const apiDocument = require("./api.json");
server.get("/api/docs/*", ...SwaggerUI.serve);
server.get("/api/docs/", SwaggerUI.setup(apiDocument));

// Management UI
server.get("/web/*", Restify.plugins.serveStatic({
  directory: "./mgmtui",
  file: "index.html",
  appendRequestPath: false
}));

// Healthcheck endpoint
server.get("/healthcheck", (req, res, next) => {
  debug(`req.url=${req.url}`);
  res.send(200);
  next();
});

// List all TS streams
server.get("/api/v1/streams", wrap(async (req, res, next) => {
  debug(`req.url=${req.url}`);

  try {
    const streams = await api.listStreams();
    res.send(200, streams);
    next();
  } catch(errObj) {
    debug("Error: %o", errObj);
    const err = new errs.InternalServerError(errObj.message);
    next(err);
  }
}));

// Get status of a TS stream
server.get("/api/v1/streams/:id", (req, res, next) => {
  debug(`req.url=${req.url}`);
  debug(`params.id=${req.params.id}`);

  try {
    const status = api.getStatusForStream(req.params.id);
    res.send(200, status);
    next();
  } catch(errObj) {
    debug("Error: %o", errObj); 
    const err = new errs.InternalServerError(errObj.message);
    next(err);
  }
});

// Change status of a TS stream
server.put("/api/v1/streams/:id", wrap(async (req, res, next) => {
  debug(`req.url=${req.url}`);
  debug(`params.id=${req.params.id}`);
  debug("req.body=%o", req.body);

  if (req.body) {
    try {
      let newStatus;
      let audioStreams = req.body.audioStreams || 1;
      let channels = req.body.channels || 2;
      let type = req.body.type || "testsrc1080p25";

      if (req.body.state === "starting") {
        newStatus = await api.startStream(req.params.id, req.body.destAddress, req.body.destPort, audioStreams, channels, type)
      } else if (req.body.state === "stopping") {
        newStatus = await api.stopStream(req.params.id);
      } else {
        throw new Error("Invalid state requested, expecting [starting|stopping]");
      }
      debug(newStatus);
      res.send(200, newStatus);
      next();
    } catch(errObj) {
      debug("Error: %o", errObj);
      const err = new errs.InternalServerError(errObj.message);
      next(err);
    }
  } else {
    next(new errs.InvalidContentError("Missing Request Body"));
  }
}));

api.setupStreams(process.env.STREAMS || 4);

server.listen(process.env.PORT || 3000, () => {
  debug(`${server.name} listening at ${server.url}`);
});