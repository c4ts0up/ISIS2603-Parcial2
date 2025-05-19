import { IsInt, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class ResenaDto {
  @Expose()
  @IsNotEmpty()
  comentario: string;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  calificacion: number;

  @Expose()
  @IsNotEmpty()
  fecha: string;

  /*
  dada la elección de manejar las reseñas bajo su propio recurso (y no como
  sub recursos de Estudiante o Actividad), se pasarán ambos IDs en el cuerpo
   */
  @Expose()
  @IsNotEmpty()
  estudianteId: number;

  @Expose()
  @IsNotEmpty()
  actividadId: number;
}
