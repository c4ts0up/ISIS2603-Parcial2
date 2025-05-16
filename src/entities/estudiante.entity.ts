import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Resena } from './reseña.entity';
import { Actividad } from './actividad.entity';

@Entity()
export class Estudiante {
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

  @OneToMany(() => Resena, (resena: Resena) => resena.estudiante)
  resenas: Resena[];

  @ManyToMany(() => Actividad, (actividad: Actividad) => actividad.estudiantes)
  actividades: Actividad[];
}

