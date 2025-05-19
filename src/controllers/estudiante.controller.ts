import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { EstudianteService } from '../services/estudiante.service';
import { EstudianteDto } from '../dtos/estudiante.dto';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('')
  crearEstudiante(@Body() estudianteDto: EstudianteDto) {
    return this.estudianteService.crearEstudiante(estudianteDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':estudianteId')
  findEstudianteById(@Param('estudianteId') estudianteId: number) {
    return this.estudianteService.findEstudianteById(estudianteId);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':estudianteId/actividades/:actividadId')
  inscribirseActividad(
    @Param('estudianteId') estudianteId: number,
    @Param('actividadId') actividadId: number,
  ) {
    return this.estudianteService.inscribirseActividad(
      estudianteId,
      actividadId,
    );
  }
}
