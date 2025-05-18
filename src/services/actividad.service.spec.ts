import { EstudianteEntity } from '../entities/estudiante.entity';
import { ActividadService } from './actividad.service';
import { Repository } from 'typeorm';
import { ActividadEntity } from '../entities/actividad.entity';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ActividadDto } from '../dtos/actividad.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ActividadService', () => {
  let service: ActividadService;
  let actividadRepository: Repository<ActividadEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;

  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActividadService,
        { provide: getRepositoryToken(ActividadEntity), useClass: Repository },
        { provide: getRepositoryToken(EstudianteEntity), useClass: Repository },
      ],
    }).compile();

    service = module.get(ActividadService);
    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );

    // inicializar pipeline de validación
    validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  });

  // servicio ha sido inicializado correctamente
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearEstudiante', () => {
    let mockActividad: ActividadDto;
    let mockActividadEntity: ActividadEntity;

    beforeEach(() => {
      jest.clearAllMocks();

      mockActividad = {
        titulo: 'Plastilina Galáctica',
        fecha: '2100-11-30',
        cupoMaximo: 200,
        estado: 0,
      };

      mockActividadEntity = {
        id: 1,
        estudiantes: [],
        resenas: [],
        ...mockActividad,
      };

      jest
        .spyOn(actividadRepository, 'save')
        .mockResolvedValue(mockActividadEntity);
      jest
        .spyOn(actividadRepository, 'create')
        .mockReturnValue(mockActividad as ActividadEntity);
    });

    it('crea actividad exitosamente', async () => {
      const result = await service.crearActividad(mockActividad);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(actividadRepository.save).toHaveBeenCalledWith(
        mockActividad as ActividadEntity,
      );
      expect(result).toBe(mockActividadEntity);
    });

    it('titulo tiene menos de 15 caracteres', async () => {
      mockActividad.titulo = 'Plastilina';

      try {
        await validationPipe.transform(mockActividad, {
          type: 'body',
          metatype: ActividadEntity,
        });
        fail('La validación debió fallar');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('titulo tiene símbolos', async () => {
      mockActividad.titulo = 'Plastilina Galactica !';

      try {
        await validationPipe.transform(mockActividad, {
          type: 'body',
          metatype: ActividadEntity,
        });
        fail('La validación debió fallar');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('cambiarEstado', () => {
    let mockActividad: ActividadDto;
    let mockActividadEntity: ActividadEntity;
    let mockEstudiantes: EstudianteEntity[];

    beforeEach(() => {
      mockActividad = {
        titulo: 'Plastilina Galáctica',
        fecha: '2100-11-30',
        cupoMaximo: 5,
        estado: 0,
      };

      mockEstudiantes = [
        {
          id: 1,
          numeroCedula: 1,
          nombre: 'Student 1',
          correo: 'student1@example.com',
          programa: 'Program 1',
          semestre: 1,
          resenas: [],
          actividades: [],
        },
        {
          id: 2,
          numeroCedula: 2,
          nombre: 'Student 2',
          correo: 'student2@example.com',
          programa: 'Program 2',
          semestre: 2,
          resenas: [],
          actividades: [],
        },
        {
          id: 3,
          numeroCedula: 3,
          nombre: 'Student 3',
          correo: 'student3@example.com',
          programa: 'Program 3',
          semestre: 3,
          resenas: [],
          actividades: [],
        },
        {
          id: 4,
          numeroCedula: 4,
          nombre: 'Student 4',
          correo: 'student4@example.com',
          programa: 'Program 4',
          semestre: 4,
          resenas: [],
          actividades: [],
        },
      ];

      mockActividadEntity = {
        ...mockActividad,
        id: 1,
        estudiantes: mockEstudiantes,
        resenas: [],
      };

      jest
        .spyOn(actividadRepository, 'findOne')
        .mockResolvedValue(mockActividadEntity);
      jest
        .spyOn(actividadRepository, 'save')
        .mockResolvedValue(mockActividadEntity);
    });

    describe('finalizada', () => {
      it('finalizada exitosamente', async () => {
        // el estado no interesa, únicamente si no hay cupo
        mockActividadEntity.cupoMaximo = mockEstudiantes.length;
        mockActividadEntity.estado = 1;

        const result = await service.cambiarEstado(mockActividadEntity.id, 2);

        expect(result.estado).toBe(2);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(actividadRepository.save).toHaveBeenCalledWith(
          mockActividadEntity,
        );
      });

      it('hay cupos', async () => {
        mockActividadEntity.cupoMaximo = mockEstudiantes.length + 1;
        mockActividadEntity.estado = 1;

        await expect(
          service.cambiarEstado(mockActividadEntity.id, 2),
        ).rejects.toThrow(ConflictException);
      });

      it('cambio inválido (ya fue finalizada)', async () => {
        mockActividadEntity.cupoMaximo = mockEstudiantes.length + 1;
        mockActividadEntity.estado = 2;

        await expect(
          service.cambiarEstado(mockActividadEntity.id, 2),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('cerrada', () => {
      it('cerrada exitosamente', async () => {
        // == 80% del cupo para que se cierre exitosamente
        mockActividadEntity.cupoMaximo = mockEstudiantes.length + 1;
        mockActividadEntity.estado = 0;

        const result1 = await service.cambiarEstado(mockActividadEntity.id, 1);

        expect(result1.estado).toBe(1);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(actividadRepository.save).toHaveBeenCalledWith(
          mockActividadEntity,
        );

        // > 80% del cupo para que se cierre exitosamente
        mockActividadEntity.cupoMaximo = mockEstudiantes.length;
        mockActividadEntity.estado = 0;

        const result2 = await service.cambiarEstado(mockActividadEntity.id, 1);

        expect(result2.estado).toBe(1);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(actividadRepository.save).toHaveBeenCalled();
      });

      it('<80% del cupo está lleno', async () => {
        mockActividadEntity.cupoMaximo = mockEstudiantes.length + 100;
        mockActividadEntity.estado = 0;

        await expect(
          service.cambiarEstado(mockActividadEntity.id, 1),
        ).rejects.toThrow(ConflictException);
      });

      it('cambio inválido (ya fue cerrada)', async () => {
        mockActividadEntity.cupoMaximo = mockEstudiantes.length + 100;
        mockActividadEntity.estado = 1;

        await expect(
          service.cambiarEstado(mockActividadEntity.id, 1),
        ).rejects.toThrow(BadRequestException);
      });
    });
  });

  describe('findActividadById', () => {
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
    });

    it('existe', async () => {
      const result = await service.findActividadById(mockActividadEntity.id);

      expect(result).toBe(mockActividadEntity);
    });

    it('no existe', async () => {
      jest.spyOn(actividadRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findActividadById(mockActividadEntity.id),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
