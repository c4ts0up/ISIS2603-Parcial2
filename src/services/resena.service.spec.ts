import { ActividadService } from './actividad.service';
import { ResenaService } from './resena.service';
import { EstudianteService } from './estudiante.service';
import { ActividadEntity } from '../entities/actividad.entity';
import { Repository } from 'typeorm';
import { EstudianteEntity } from '../entities/estudiante.entity';
import { ResenaEntity } from '../entities/resena.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResenaDto } from '../dtos/resena.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ResenaService', () => {
  let resenaService: ResenaService;
  let actividadService: ActividadService;
  let estudianteService: EstudianteService;

  let resenaRepository: Repository<ResenaEntity>;

  let mockResenaDto: ResenaDto;
  let mockResenaEntity: ResenaEntity;
  let mockEstudianteEntity: EstudianteEntity;
  let mockActividadEntity: ActividadEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResenaService,
        EstudianteService,
        ActividadService,
        { provide: getRepositoryToken(ActividadEntity), useClass: Repository },
        { provide: getRepositoryToken(EstudianteEntity), useClass: Repository },
        {
          provide: getRepositoryToken(ResenaEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    jest.clearAllMocks();

    resenaService = module.get(ResenaService);
    actividadService = module.get(ActividadService);
    estudianteService = module.get(EstudianteService);
    resenaRepository = module.get<Repository<ResenaEntity>>(
      getRepositoryToken(ResenaEntity),
    );

    const mockEstudianteDto = {
      numeroCedula: 1000222333,
      nombre: 'Hari Seldon',
      correo: 'hari.seldon@mail.com',
      programa: 'Psicohistoria',
      semestre: 6,
    };

    mockEstudianteEntity = {
      id: 2,
      resenas: [],
      actividades: [mockActividadEntity],
      ...mockEstudianteDto,
    };

    const mockActividadDto = {
      titulo: 'Plastilina Galáctica',
      fecha: '2100-11-30',
      cupoMaximo: 200,
      estado: 2,
    };

    mockActividadEntity = {
      id: 1,
      estudiantes: [mockEstudianteEntity],
      resenas: [],
      ...mockActividadDto,
    };

    mockResenaDto = {
      comentario: 'Excelente actividad! Me fascinó.',
      calificacion: 5,
      fecha: '2100-12-01',
      estudianteId: 2,
      actividadId: 1,
    };

    mockResenaEntity = {
      ...mockResenaEntity,
      id: 1,
      estudiante: mockEstudianteEntity,
      actividad: mockActividadEntity,
    };

    jest.spyOn(resenaRepository, 'findOne').mockResolvedValue(mockResenaEntity);
    jest.spyOn(resenaRepository, 'save').mockResolvedValue(mockResenaEntity);
    jest.spyOn(resenaRepository, 'create').mockReturnValue(mockResenaEntity);

    jest
      .spyOn(actividadService, 'findActividadById')
      .mockResolvedValue(mockActividadEntity);
    jest
      .spyOn(estudianteService, 'findEstudianteById')
      .mockResolvedValue(mockEstudianteEntity);
  });

  // servicio se ha inicializado correctamente
  it('should be defined', () => {
    expect(resenaService).toBeDefined();
  });

  describe('findResenaById', () => {
    it('existe', async () => {
      const result = await resenaService.findResenaById(mockResenaEntity.id);

      expect(result).toBe(mockResenaEntity);
    });

    it('no existe', async () => {
      jest.spyOn(resenaRepository, 'findOne').mockResolvedValue(null);

      await expect(
        resenaService.findResenaById(mockResenaEntity.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('agregarResena', () => {
    it('reseña agregada exitosamente', async () => {
      const result = await resenaService.agregarResena(mockResenaDto);

      expect(result).toBe(mockResenaEntity);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(resenaRepository.save).toHaveBeenCalledWith(mockResenaEntity);
      // las relaciones se garantizan por el manejo de TypeORM
    });

    it('no existe la actividad', async () => {
      jest
        .spyOn(actividadService, 'findActividadById')
        .mockRejectedValue(new NotFoundException());
      mockResenaDto.actividadId = 1000;

      await expect(resenaService.agregarResena(mockResenaDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('no existe el estudiante', async () => {
      jest
        .spyOn(estudianteService, 'findEstudianteById')
        .mockRejectedValue(new NotFoundException());
      mockResenaDto.estudianteId = 1000;

      await expect(resenaService.agregarResena(mockResenaDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('la actividad no está finalizada', async () => {
      mockActividadEntity.estado = 1;

      await expect(resenaService.agregarResena(mockResenaDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('el estudiante no está inscrito en la actividad', async () => {
      mockActividadEntity.estudiantes.pop();
      mockEstudianteEntity.actividades.pop();

      await expect(resenaService.agregarResena(mockResenaDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
