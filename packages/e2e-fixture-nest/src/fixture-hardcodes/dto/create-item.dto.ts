import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO com literais para exercitar detecção em decorators e propriedades.
 */
export class CreateItemDto {
  @IsString({ message: 'O nome deve ser texto' })
  @MinLength(2, { message: 'Nome muito curto para o item' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Descrição opcional inválida' })
  description?: string;

  /** Metadado fixo usado apenas na massa de teste */
  static readonly schemaVersion = 'dto-v1';

  static readonly labels = {
    submit: 'Enviar item',
    cancel: 'Cancelar',
  };
}
