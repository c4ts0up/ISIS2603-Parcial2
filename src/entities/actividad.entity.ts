import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';

@Entity()
export class Actividad {
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
    () => Estudiante,
    (estudiante: Estudiante) => estudiante.actividades,
  )
  estudiantes: Estudiante[];
}
