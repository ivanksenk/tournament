import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix(String(config.get('HTTP_PREFIX')))
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tournament Api')
    .setDescription('Test Work Kosenko I.V.')
    .setVersion('1.0')
    .addServer(`${config.get('HTTP_HOST')}:${config.get('HTTP_PORT')}`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${config.get('HTTP_PREFIX')}/docs`, app, document)
  await app.listen(process.env.PORT ?? 4200);
}
bootstrap();
