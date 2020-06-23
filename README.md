# AWS-Lambda-fastify & NestJS Serverless example

This is used to show problem with Websocket Api communication

## Installation

```bash
npm install
```

## Build & Running the app

```bash
npm build
```

Launch the serverless offline

```
npm run start:sls
```

If all goes well the API Endpoint should be available on `3000` port and WS should be available on port `3001`

http://localhost:3000
ws://localhost:3001

To test those

`curl http://localhost:3000/dev/fastify`
or
`curl http://localhost:3000/dev/serverless`

To Test WS endpoint use

`npm install -g wscat`

`wscat -c ws://localhost:3001`

To change between aws-lambda-fastify and serverless-fastify

Comment out the right handler from the serverless.yml file

```
    ws:
        # To test other
        # handler: src/aws-lambda-fastify.handler
        handler: src/serverless-fastify.handler
```
