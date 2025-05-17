import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { ResenaEntity } from './resena.entity';

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

  @OneToMany(() => ResenaEntity, (resena: ResenaEntity) => resena.actividad)
  resenas: ResenaEntity[];
}
