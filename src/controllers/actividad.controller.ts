import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ActividadService } from '../services/actividad.service';
import { ActividadDto } from '../dtos/actividad.dto';

@Controller('actividad')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('')
  crearActividad(@Body() actividadDto: ActividadDto) {
    return this.actividadService.crearActividad(actividadDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':actividadId')
  findActividadById(@Param('actividadId') actividadId: number) {
    return this.actividadService.findActividadById(actividadId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  findAllActividadesByDate(@Query('fecha') fecha: string) {
    return this.actividadService.findAllActividadesByDate(fecha);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':actividadId/estado')
  cambiarEstado(
    @Param('actividadId') actividadId: number,
    @Param('estado') @Body() estado: number,
  ) {
    return this.actividadService.cambiarEstado(actividadId, estado);
  }
}
