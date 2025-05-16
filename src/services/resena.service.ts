import { ResenaEntity } from '../entities/resena.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResenaDto } from '../dto/resena.dto';
import { NotFoundException } from '@nestjs/common';

export class ResenaService {
  constructor(
    @InjectRepository(ResenaEntity)
    private readonly resenaRepository: Repository<ResenaEntity>,
  ) {}

  async agregarResena(resenaDto: ResenaDto) {
    await this.resenaRepository.save(resenaDto);
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
