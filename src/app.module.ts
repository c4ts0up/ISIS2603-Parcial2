import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActividadService } from './services/actividad.service';
import { EstudianteService } from './services/estudiante.service';
import { ResenaService } from './services/resena.service';

@Module({
  imports: [ActividadService, EstudianteService, ResenaService],
  controllers: [AppController],
  exports: [ActividadService, EstudianteService, ResenaService],
  providers: [AppService, ActividadService, EstudianteService, ResenaService],
})
export class AppModule {}
