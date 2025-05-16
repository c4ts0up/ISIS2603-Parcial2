import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';

@Entity()
export class ActividadEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  titulo: string;

  @Column({ type: 'varchar' })
  fecha: string;

  @Column({ type: 'int' })
  cupoMaximo: number;

  @Column({ type: 'int' })
  estado: number;

  @ManyToMany(
    () => EstudianteEntity,
    (estudiante: EstudianteEntity) => estudiante.actividades,
  )
  estudiantes: EstudianteEntity[];
}
