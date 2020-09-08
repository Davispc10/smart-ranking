import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator'

import { DesafioStatus } from '../interfaces/desafio-status.enum'

export class AtualizarDesafioDto {
  @IsDate()
  @IsOptional()
  dataHoraDesafio: Date;

  @IsString()
  @IsNotEmpty()
  status: DesafioStatus;
}
