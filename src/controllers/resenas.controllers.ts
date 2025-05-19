import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ResenaService } from '../services/resena.service';
import { ResenaDto } from '../dtos/resena.dto';

/*
  Aunque no ortodoxo, dado que las reseñas son compuestas con los estudiantes y actividades,
  la propuesta de un endpoint por ID según el documento del parcial sugiere que
  se desea separar los recursos de esta manera.
 */
@Controller('resena')
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  agregarResena(@Body() resenaDto: ResenaDto) {
    return this.resenaService.agregarResena(resenaDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':resenaId')
  findResenaById(@Param('resenaId') resenaId: number) {
    return this.resenaService.findResenaById(resenaId);
  }
}
