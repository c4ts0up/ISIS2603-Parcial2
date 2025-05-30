import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResenaEntity } from './resena.entity';
import { ActividadEntity } from './actividad.entity';

@Entity()
export class EstudianteEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  numeroCedula: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  correo: string;

  @Column({ type: 'varchar' })
  programa: string;

  @Column({ type: 'int' })
  semestre: number;

  @OneToMany(() => ResenaEntity, (resena: ResenaEntity) => resena.estudiante)
  resenas: ResenaEntity[];

  @ManyToMany(
    () => ActividadEntity,
    (actividad: ActividadEntity) => actividad.estudiantes,
  )
  @JoinTable({
    name: 'actividad_estudiante',
    joinColumn: {
      name: 'estudianteId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'actividadId',
      referencedColumnName: 'id',
    },
  })
  actividades: ActividadEntity[];
}
