import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ActividadEntity } from '../entities/actividad.entity';
import { ActividadDto } from '../dto/actividad.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async crearActividad(actividadDto: ActividadDto) {
    // reglas de validación en el DTO
    return await this.actividadRepository.save(actividadDto);
  }

  async findActividadById(actividadId: number) {
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
    });

    if (actividad === null) {
      throw new NotFoundException('Actividad no encontrada');
    }

    return actividad;
  }

  async cambiarEstado(actividadId: number, estado: number) {
    if (estado !== 0 && estado !== 1 && estado !== 2) {
      throw new BadRequestException('El número del estado no es válido');
    }

    // validación de existencia
    await this.findActividadById(actividadId);

    await this.actividadRepository.update(actividadId, {
      estado: estado,
    });
  }

  async findAllActividadesByDate(fecha: string) {
    return await this.actividadRepository.findOne;
  }
}