import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger(AppModule.name);
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Slowboat API')
    .setDescription('Slowboat API description')
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix('v1', {
    exclude: ['/', '/swagger', '/swagger/json'],
  });

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  app.use(helmet());
  app.enableCors();

  const PORT = process.env.APP_PORT ?? 3000;

  await app.listen(PORT, () => {
    logger.log(`App listening on port ${PORT}`);
  });
}

bootstrap();
