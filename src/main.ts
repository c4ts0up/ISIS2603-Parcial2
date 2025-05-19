import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances (uses class-transformer)
      transformOptions: {
        enableImplicitConversion: true, // Allows automatic conversion of primitive types (e.g., string to number for path/query params if type-hinted)
      },
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI, //  Use URI path versioning
    defaultVersion: '1', //  Set the default version if no version is specified
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
