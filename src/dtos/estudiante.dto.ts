import { Expose } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class EstudianteDto {
  @Expose()
  @IsNotEmpty()
  numeroCedula: number;

  @Expose()
  @IsNotEmpty()
  nombre: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @Expose()
  @IsNotEmpty()
  programa: string;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  semestre: number;
}
