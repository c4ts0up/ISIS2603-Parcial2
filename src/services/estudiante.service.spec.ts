import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { EstudianteEntity } from '../entities/estudiante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstudianteDto } from '../dtos/estudiante.dto';
import { EstudianteService } from './estudiante.service';
import { ActividadEntity } from '../entities/actividad.entity';
import { ActividadService } from './actividad.service';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;
  let actividadService: ActividadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActividadService,
        EstudianteService,
        { provide: getRepositoryToken(ActividadEntity), useValue: Repository },
        { provide: getRepositoryToken(EstudianteEntity), useClass: Repository },
      ],
    }).compile();

    actividadService = module.get(ActividadService);
    service = module.get(EstudianteService);
    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
  });

  describe('crearEstudiante', () => {
    let mockEstudianteDto: EstudianteDto;
    let mockEstudianteEntity: EstudianteEntity;

    beforeEach(() => {
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
        .spyOn(estudianteRepository, 'save')
        .mockResolvedValue(mockEstudianteEntity);
    });

    it('estudiante creado exitosamente', async () => {
      const result = await service.crearEstudiante(mockEstudianteDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(estudianteRepository.save).toHaveBeenCalledWith(mockEstudianteDto);
      expect(result).toBe(mockEstudianteEntity);
    });
  });
});
