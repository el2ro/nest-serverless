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

curl http://localhost:3000/dev/test

wscat -c ws://localhost:3001
