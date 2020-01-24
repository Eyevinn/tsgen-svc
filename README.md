## Eyevinn Transport Stream Generator

A containerized service that provides the functionality to generate MPEG TS streams.

```
$ docker build -t tsgen-svc:1 .
$ docker run --rm -d -p 3000:3000 tsgen-svc:1
```

API docs (Swagger) available at `{{BaseURL}}/api/docs/`

## Usage

### List available stream slots

```
$ curl -X GET "http://localhost:3000/api/v1/streams" -H "accept: application/json"
```

### Start a test stream on slot with ID 1

Generate an MPEG TS and start streaming to 192.168.1.40 and port 1230

```
$ curl -X PUT "http://localhost:3000/api/v1/streams/1" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"id\":1,\"destAddress\":\"192.168.1.40\",\"destPort\":1230,\"audioStreams\":4,\"channels\":2,\"type\":\"testsrc720p25\",\"state\":\"starting\"}"
```

Open then for example VLC to receive on port 1230

![Screenshot](tsgen-sc.png)


### Stop a stream on slot with ID 1

```
$ curl -X PUT "http://localhost:3000/api/v1/streams/1" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"id\":1,\"destAddress\":\"192.168.1.40\",\"destPort\":1230,\"audioStreams\":4,\"channels\":2,\"type\":\"testsrc720p25\",\"state\":\"stopping\"}"
```

## LICENSE

[MIT License](https://github.com/Eyevinn/tsgen-svc/blob/master/LICENSE)
