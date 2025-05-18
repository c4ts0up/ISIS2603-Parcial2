import { EstudianteEntity } from '../entities/estudiante.entity';
import { ActividadService } from './actividad.service';
import { Repository } from 'typeorm';
import { ActividadEntity } from '../entities/actividad.entity';
import { BadRequestException, ConflictException, ValidationPipe } from '@nestjs/common';
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

    beforeEach(() => {
      jest.clearAllMocks();

      mockActividad = {
        titulo: 'Plastilina Galáctica',
        fecha: '2100-11-30',
        cupoMaximo: 200,
        estado: 0,
      };

      jest
        .spyOn(actividadRepository, 'save')
        .mockResolvedValue(mockActividad as ActividadEntity);
      jest
        .spyOn(actividadRepository, 'create')
        .mockReturnValue(mockActividad as ActividadEntity);
    });

    it('crea actividad exitosamente', async () => {
      const result = await service.crearActividad(mockActividad);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(actividadRepository.save).toHaveBeenCalledWith({
        ...mockActividad,
      });
      expect(result).toBe(mockActividad as ActividadEntity);
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
});
