import { Document } from 'mongoose'
import { IJogador } from 'src/jogadores/interfaces/jogador.interface'

export interface ICategoria extends Document {
  readonly categoria: string;
  descricao: string;
  eventos: Array<IEvento>;
  jogadores: Array<IJogador>;
}

export interface IEvento {
  nome: string;
  operacao: string;
  valor: number;
}
