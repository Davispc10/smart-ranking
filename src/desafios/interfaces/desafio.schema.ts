import { Schema } from 'mongoose'

export const DesafioSchema = new Schema(
  {
    datahoraDesafio: {
      type: Date
    },
    status: {
      type: String
    },
    dataHoraSolicitacao: {
      type: Date
    },
    dataHoraResposta: {
      type: Date
    },
    solicitante: {
      type: Schema.Types.ObjectId,
      ref: 'Jogador'
    },
    categoria: {
      type: String
    },
    jogadores: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Jogador'
      }
    ],
    partida: {
      type: Schema.Types.ObjectId,
      ref: 'Partida'
    }
  },
  {
    timestamps: true,
    collection: 'desafios'
  }
)
