import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstudianteEntity } from '../entities/estudiante.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActividadEntity } from '../entities/actividad.entity';
import { EstudianteDto } from '../dtos/estudiante.dto';
import { ActividadService } from './actividad.service';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
    private actividadService: ActividadService,
  ) {}

  async crearEstudiante(
    estudianteDto: EstudianteDto,
  ): Promise<EstudianteEntity> {
    const estudiante = this.estudianteRepository.create(estudianteDto);
    // reglas de validación en el DTO
    return await this.estudianteRepository.save(estudiante);
  }

  async findEstudianteById(idEstudiante: number): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: idEstudiante },
      relations: ['actividades', 'resenas'],
    });

    if (estudiante === null) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return estudiante;
  }

  async inscribirseActividad(
    estudianteId: number,
    actividadId: number,
  ): Promise<void> {
    const estudiante = await this.findEstudianteById(estudianteId);
    const actividad =
      await this.actividadService.findActividadById(actividadId);

    if (actividad.estado !== 0) {
      throw new ConflictException(
        'La actividad no está abierta para inscripciones.',
      );
    } else if (actividad.cupoMaximo <= actividad.estudiantes.length) {
      throw new ConflictException('La actividad no tiene cupos disponibles.');
    } else if (actividad.estudiantes.includes(estudiante)) {
      throw new ConflictException(
        'El estudiante ya está inscrito en la actividad.',
      );
    }

    estudiante.actividades.push(actividad);
    actividad.estudiantes.push(estudiante);

    await Promise.all([
      this.estudianteRepository.save(estudiante),
      this.actividadRepository.save(actividad),
    ]);
  }
}
