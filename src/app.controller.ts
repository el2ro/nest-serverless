import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getHelloTest(): string {
    return 'Hello World! Test2';
  }

  @Get('fastify')
  getFastify(): string {
    return 'Hello Fastify';
  }

  @Get('serverless')
  getServerless(): string {
    return 'Hello Serverless';
  }
}
