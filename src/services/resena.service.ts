import { ResenaEntity } from '../entities/resena.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResenaDto } from '../dtos/resena.dto';
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

  async agregarResena(resenaDto: ResenaDto): Promise<ResenaEntity> {
    // valida la existencia de actividad y estudiante, de paso
    await this.actividadService.findActividadById(resenaDto.actividadId);
    await this.estudianteService.findEstudianteById(resenaDto.estudianteId);

    const resena = this.resenaRepository.create(resenaDto);

    if (resena.actividad.estado !== 2) {
      throw new ConflictException(
        'No se puede agregar una reseña a una actividad no finalizada.',
      );
    } else if (
      resena.actividad.estudiantes.find(
        (estudiante) => estudiante.id === resena.estudiante.id,
      ) === undefined
    ) {
      throw new ConflictException(
        'El estudiante no estuvo inscrito en la actividad',
      );
    }

    return await this.resenaRepository.save(resena);
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
