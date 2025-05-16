import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';

@Entity()
export class Resena {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  comentario: string;

  @Column({ type: 'int'})
  calificacion: number;

  @Column({ type: 'varchar'})
  fecha: string;

  @ManyToOne(() => Estudiante, (estudiante: Estudiante) => estudiante.resenas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  estudiante: Estudiante;
}
