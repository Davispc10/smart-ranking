import { Schema } from 'mongoose'

export const PartidaSchema = new Schema(
  {
    categoria: {
      type: String
    },
    jogadores: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Jogador'
      }
    ],
    def: {
      type: Schema.Types.ObjectId,
      ref: 'Jogador'
    },
    resultado: [
      {
        set: { type: String }
      }
    ]
  },
  {
    timestamps: true,
    collection: 'partidas'
  }
)
