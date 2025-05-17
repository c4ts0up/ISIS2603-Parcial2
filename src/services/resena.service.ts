import { ResenaEntity } from '../entities/resena.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResenaDto } from '../dto/resena.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { EstudianteService } from './estudiante.service';

export class ResenaService {
  constructor(
    @InjectRepository(ResenaEntity)
    private readonly resenaRepository: Repository<ResenaEntity>,
    private actividadService: ActividadService,
    private estudianteService: EstudianteService,
  ) {}

  async agregarResena(resenaDto: ResenaDto) {
    // FIXME: la creación es correcta?
    const resena = this.resenaRepository.create(resenaDto);

    if (resena.actividad.estado !== 2) {
      throw new ConflictException('La actividad no está finalizada');
    }

    if (
      resena.actividad.estudiantes.find(
        (estudiante) => estudiante.id === resena.estudiante.id,
      ) === undefined
    ) {
      throw new ConflictException(
        'El estudiante no estuvo inscrito en la actividad',
      );
    }

    await this.resenaRepository.save(resena);
  }

  // instrucciones decían findClaseById, pero este nombre tiene más sentido
  async findResenaById(resenaId: number) {
    const resena = await this.resenaRepository.findOne({
      where: { id: resenaId },
    });

    if (resena === null) {
      throw new NotFoundException('Resena no encontrada');
    }

    return resena;
  }
}
