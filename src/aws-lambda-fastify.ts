import { NestFactory } from '@nestjs/core';
import {
  //APIGatewayEvent,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  //Callback,
  Context,
  Handler,
} from 'aws-lambda';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as awsLambdaFastify from 'aws-lambda-fastify';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as fastify from 'fastify';

import { AppModule } from './app.module';

interface NestApp {
  app: NestFastifyApplication;
  instance: fastify.FastifyInstance;
}

export async function bootstrap(): Promise<NestApp> {
  const serverOptions: fastify.ServerOptionsAsHttp = {
    logger: true,
  };
  const instance: fastify.FastifyInstance = fastify(serverOptions);
  // env = process.env;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
    {
      logger: 'local' === process.env['APP_STAGE'] ? new Logger() : console,
    },
  );

  // app.use(eventContext());
  // app.enableCors();
  // app.setGlobalPrefix('v1');
  // app.useGlobalPipes(new ValidationPipe());

  //if (!isLocal) {
  // Following are only needed when running in AWS lambda function
  await app.init();
  //}

  return {
    app,
    instance,
  };
  // Lambda should have shutdown
  // await app.close();
}

let cachedNestApp: NestApp;
const binaryMimeTypes: string[] = [];

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  if (!cachedNestApp) {
    cachedNestApp = await bootstrap();
  }

  const proxy = awsLambdaFastify(cachedNestApp.instance);
  return proxy(event, context /*, binaryMimeTypes*/);
};
