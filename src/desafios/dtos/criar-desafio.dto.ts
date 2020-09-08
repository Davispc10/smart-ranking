import {
  IsNotEmpty,
  IsDateString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator'
import { IJogador } from 'src/jogadores/interfaces/jogador.interface'

export class CriarDesafioDto {
  @IsDateString()
  @IsNotEmpty()
  datahoraDesafio: Date;

  @IsNotEmpty()
  solicitante: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  jogadores: IJogador[];
}
