import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { EstudianteEntity } from '../entities/estudiante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstudianteDto } from '../dtos/estudiante.dto';
import { EstudianteService } from './estudiante.service';
import { ActividadEntity } from '../entities/actividad.entity';
import { ActividadService } from './actividad.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ActividadDto } from '../dtos/actividad.dto';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;

  let mockEstudianteDto: EstudianteDto;
  let mockEstudianteEntity: EstudianteEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActividadService,
        EstudianteService,
        { provide: getRepositoryToken(ActividadEntity), useClass: Repository },
        { provide: getRepositoryToken(EstudianteEntity), useClass: Repository },
      ],
    }).compile();

    service = module.get(EstudianteService);
    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );

    jest.clearAllMocks();

    mockEstudianteDto = {
      numeroCedula: 1000222333,
      nombre: 'Hari Seldon',
      correo: 'hari.seldon@mail.com',
      programa: 'Psicohistoria',
      semestre: 6,
    };

    mockEstudianteEntity = {
      id: 1,
      resenas: [],
      actividades: [],
      ...mockEstudianteDto,
    };

    jest
      .spyOn(estudianteRepository, 'create')
      .mockReturnValue(mockEstudianteDto as EstudianteEntity);
    jest
      .spyOn(estudianteRepository, 'save')
      .mockResolvedValue(mockEstudianteEntity);
    jest
      .spyOn(estudianteRepository, 'findOne')
      .mockResolvedValue(mockEstudianteEntity);
  });

  describe('crearEstudiante', () => {
    it('estudiante creado exitosamente', async () => {
      const result = await service.crearEstudiante(mockEstudianteDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(estudianteRepository.save).toHaveBeenCalledWith(mockEstudianteDto);
      expect(result).toBe(mockEstudianteEntity);
    });
  });

  describe('findEstudianteById', () => {
    it('existe', async () => {
      const result = await service.findEstudianteById(mockEstudianteEntity.id);

      expect(result).toBe(mockEstudianteEntity);
    });

    it('no existe', async () => {
      jest.spyOn(estudianteRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findEstudianteById(mockEstudianteEntity.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('inscribirseActividad', () => {
    let mockActividad: ActividadDto;
    let mockActividadEntity: ActividadEntity;

    beforeEach(() => {
      mockActividad = {
        titulo: 'Plastilina Galáctica',
        fecha: '2100-11-30',
        cupoMaximo: 5,
        estado: 0,
      };

      mockActividadEntity = {
        ...mockActividad,
        id: 1,
        estudiantes: [],
        resenas: [],
      };

      jest
        .spyOn(actividadRepository, 'findOne')
        .mockResolvedValue(mockActividadEntity);
      jest
        .spyOn(actividadRepository, 'save')
        .mockResolvedValue(mockActividadEntity);
    });

    it('inscripción exitosa', async () => {
      await service.inscribirseActividad(
        mockEstudianteEntity.id,
        mockActividadEntity.id,
      );

      expect(mockEstudianteEntity.actividades).toContain(mockActividadEntity);
      expect(mockActividadEntity.estudiantes).toContain(mockEstudianteEntity);
    });

    it('no hay cupos en la actividad', async () => {
      mockActividadEntity.cupoMaximo = 0;

      await expect(
        service.inscribirseActividad(
          mockEstudianteEntity.id,
          mockActividadEntity.id,
        ),
      ).rejects.toThrow(ConflictException);

      expect(mockEstudianteEntity.actividades).not.toContain(
        mockActividadEntity,
      );
      expect(mockActividadEntity.estudiantes).not.toContain(
        mockEstudianteEntity,
      );
    });

    it('la actividad no está en estado 0 (abierta)', async () => {
      mockActividadEntity.estado = 1;

      await expect(
        service.inscribirseActividad(
          mockEstudianteEntity.id,
          mockActividadEntity.id,
        ),
      ).rejects.toThrow(ConflictException);

      expect(mockEstudianteEntity.actividades).not.toContain(
        mockActividadEntity,
      );
      expect(mockActividadEntity.estudiantes).not.toContain(
        mockEstudianteEntity,
      );
    });

    it('el estudiante estaba inscrito previamente', async () => {
      mockActividadEntity.estudiantes.push(mockEstudianteEntity);
      mockEstudianteEntity.actividades.push(mockActividadEntity);

      await expect(
        service.inscribirseActividad(
          mockEstudianteEntity.id,
          mockActividadEntity.id,
        ),
      ).rejects.toThrow(ConflictException);

      expect(
        mockEstudianteEntity.actividades.filter((actividad) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          expect
            .objectContaining({ id: mockActividadEntity.id })
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            .asymmetricMatch(actividad),
        ).length,
      ).toBe(1);
      expect(
        mockActividadEntity.estudiantes.filter((estudiante) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          expect
            .objectContaining({ id: mockEstudianteEntity.id })
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            .asymmetricMatch(estudiante),
        ).length,
      ).toBe(1);
    });
  });
});
