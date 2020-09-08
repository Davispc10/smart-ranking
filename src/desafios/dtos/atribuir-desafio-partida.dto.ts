import { IsNotEmpty } from 'class-validator'
import { IJogador } from 'src/jogadores/interfaces/jogador.interface'

import { IResultado } from '../interfaces/desafio.interface'

export class AtribuirDesafioPartidaDto {
  @IsNotEmpty()
  def: IJogador;

  @IsNotEmpty()
  resultado: IResultado[];
}
