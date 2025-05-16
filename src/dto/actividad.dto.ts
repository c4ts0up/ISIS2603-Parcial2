import { IsInt, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class ActividadDto {
  @Expose()
  @IsNotEmpty()
  @MinLength()
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