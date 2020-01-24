## Eyevinn Transport Stream Generator

A containerized service that provides the functionality to generate MPEG TS streams.

```
$ docker build -t tsgen-svc:1 .
$ docker run --rm -d -p 3000:3000 tsgen-svc:1
```

API docs (Swagger) available at `{{BaseURL}}/api/docs/`

## LICENSE

[MIT License](https://github.com/Eyevinn/tsgen-svc/blob/master/LICENSE)
