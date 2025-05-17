import { Injectable, NotFoundException } from '@nestjs/common';
import { EstudianteEntity } from '../entities/estudiante.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActividadEntity } from '../entities/actividad.entity';
import { EstudianteDto } from '../dto/estudiante.dto';
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
    // reglas de validación en el DTO
    return await this.estudianteRepository.save(estudianteDto);
  }

  async findEstudianteById(idEstudiante: number): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: idEstudiante },
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

    estudiante.actividades.push(actividad);
    actividad.estudiantes.push(estudiante);

    await Promise.all([
      this.estudianteRepository.save(estudiante),
      this.actividadRepository.save(actividad),
    ]);
  }
}
