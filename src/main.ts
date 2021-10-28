import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  await app.listen(3000);
}

function setupSwagger(app) {
  const options = new DocumentBuilder()
    .setTitle('blockchain')
    .addBearerAuth()
    .addServer('http:///')
    .addServer('https:///')
    .setDescription('blockchain API description')
    .setVersion('0.1')
    .build();

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, options));
}

bootstrap();
