import { NestFactory } from '@nestjs/core';
import {
  APIGatewayEvent,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
  Handler,
} from 'aws-lambda';
import { ValidationPipe, Logger } from '@nestjs/common';
import { proxy } from 'aws-serverless-fastify';
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
    // logger: env_variables.isDev ? undefined : false,
    logger: true,
  };
  const instance: fastify.FastifyInstance = fastify(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
    {
      logger: 'local' === process.env['APP_STAGE'] ? new Logger() : console,
    },
  );
  // app.use(eventContext());
  app.enableCors();
  // app.setGlobalPrefix('v1');
  // TODO disabled due issues app.useGlobalPipes(new ValidationPipe());

  await app.init();

  /*  console.log('*********** Proces ENV ************');
  console.log(process.env);
  console.log('******** Proces ENV - END *********');*/

  return {
    app,
    instance,
  };
  // Lambda should have shutdown
  // await app.close();
}

let cachedNestApp: NestApp;
const binaryMimeTypes: string[] = [];

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  if (!cachedNestApp) {
    cachedNestApp = await bootstrap();
  }

  return await proxy(cachedNestApp.instance, event, context, binaryMimeTypes);
};
