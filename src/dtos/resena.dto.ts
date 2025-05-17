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

  @Expose()
  @IsNotEmpty()
  estudianteId: number;

  @Expose()
  @IsNotEmpty()
  actividadId: number;
}
