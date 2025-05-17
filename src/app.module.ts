import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ActividadService } from './services/actividad.service';
import { EstudianteService } from './services/estudiante.service';
import { ResenaService } from './services/resena.service';
import { EstudianteController } from './controllers/estudiante.controller';
import { ResenaEntity } from './entities/resena.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './entities/estudiante.entity';
import { ActividadEntity } from './entities/actividad.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10), //FIXME: there should be better handling here
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [EstudianteEntity, ActividadEntity, ResenaEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity, ResenaEntity]),
  ],
  controllers: [EstudianteController],
  exports: [ActividadService, EstudianteService, ResenaService],
  providers: [AppService, ActividadService, EstudianteService, ResenaService],
})
export class AppModule {}
