import { IsInt, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class ActividadDto {
  @Expose()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,;:!?\-'()"]+$/, {
    message:
      'La descripción contiene caracteres no permitidos. Solo se permiten letras, números, espacios, tildes y puntuación común (.,;:!?-\'"()).',
  })
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
