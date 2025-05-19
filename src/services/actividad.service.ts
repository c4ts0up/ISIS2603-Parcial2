import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActividadEntity } from '../entities/actividad.entity';
import { ActividadDto } from '../dtos/actividad.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async crearActividad(actividadDto: ActividadDto): Promise<ActividadEntity> {
    const actividad = this.actividadRepository.create(actividadDto);
    // reglas de validación en el DTO
    return await this.actividadRepository.save(actividad);
  }

  async findActividadById(actividadId: number) {
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['estudiantes', 'resenas'],
    });

    if (actividad === null) {
      throw new NotFoundException('Actividad no encontrada');
    }

    return actividad;
  }

  async cambiarEstado(
    actividadId: number,
    estado: number,
  ): Promise<ActividadEntity> {
    console.log('Estado: ', estado);
    console.log('Type of estado: ', typeof estado);
    if (estado !== 0 && estado !== 1 && estado !== 2) {
      throw new BadRequestException('El número del estado no es válido');
    }

    // valida existencia de paso
    const actividad = await this.findActividadById(actividadId);

    // cambio de estado inválido
    if (actividad.estado >= estado) {
      throw new BadRequestException('Cambio de estado inválido');
    } else if (
      actividad.estado === 0 &&
      actividad.estudiantes.length / actividad.cupoMaximo < 0.8
    ) {
      throw new ConflictException(
        'El cupo necesario para cerrar no ha sido alcanzado',
      );
    } else if (
      actividad.estado === 1 &&
      actividad.estudiantes.length < actividad.cupoMaximo
    ) {
      throw new ConflictException(
        'No se puede finalizar una actividad con cupos disponibles',
      );
    }

    actividad.estado = estado;
    return await this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string) {
    return await this.actividadRepository.find({
      where: { fecha: fecha },
    });
  }
}
