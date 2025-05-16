import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';

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
  estudiante: EstudianteEntity;
}
