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
  en este escenario, la reseña es una subclase de la actividad, no del estudiante.
  Por lo tanto, el estudianteId se pasa como cuerpo y la actividad como parámetro.
   */
  @Expose()
  @IsNotEmpty()
  estudianteId: number;
}
