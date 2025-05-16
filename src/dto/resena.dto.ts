import { isInt, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class ResenaDto {
  @Expose()
  @IsNotEmpty()
  comentario: string;

  @Expose()
  @IsNotEmpty()
  @isInt()
  calificacion: number;

  @Expose()
  @IsNotEmpty()
  fecha: string;
}
