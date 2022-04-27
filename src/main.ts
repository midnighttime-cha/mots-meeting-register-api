import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MyLogger } from './shared/logger/logger.service';
const port = process.env.API_PORT;
var bodyParser = require('body-parser');
const pjson = require('../package.json');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

  await app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const swaggerCustomOptions = await {
    swaggerOptions: { docExpansion: 'list', defaultModelsExpandDepth: -1, filter: true, cacheControl: "no-cache" },
  };
  const setVersion = pjson.version;

  const config = new DocumentBuilder()
    .addServer(`${process.env.API_HOST}`, 'Local: COJ Migration')
    .addServer(`${process.env.API_HOST_PUBLIC}`, 'Public: COJ Migration')
    .setTitle('COJ Migration')
    .setDescription('The COJ Migration API description')
    .setVersion(setVersion)
    .addBearerAuth()
    .setContact('COJ Migration Developer', `${process.env.API_HOST}`, `${process.env.API_EMAIL}`)
    .addTag('Authentication & Access')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, swaggerCustomOptions);

  await app.listen(port);
  await Logger.log("==============================");
  await Logger.log(`Server running on [${process.env.SERVER_TYPE}] : ${await app.getUrl()}`, 'Bootstrap');
  await Logger.log("==============================");
}
bootstrap();
