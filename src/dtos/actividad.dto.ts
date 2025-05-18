import { IsAlphanumeric, IsInt, IsNotEmpty, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class ActividadDto {
  @Expose()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(15)
  titulo: string;

  @Expose()
  @IsNotEmpty()
  fecha: string;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  cupoMaximo: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  estado: number;
}
