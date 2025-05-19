import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from './actividad.entity';

@Entity()
export class ResenaEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  comentario: string;

  @Column({ type: 'int' })
  calificacion: number;

  @Column({ type: 'varchar' })
  fecha: string;

  @ManyToOne(
    () => EstudianteEntity,
    (estudiante: EstudianteEntity) => estudiante.resenas,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'estudianteId' })
  estudiante: EstudianteEntity;

  @ManyToOne(
    () => ActividadEntity,
    (actividad: ActividadEntity) => actividad.resenas,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'actividadId' })
  actividad: ActividadEntity;
}
