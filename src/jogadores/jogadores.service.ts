import { Model } from 'mongoose'
// import { v1 } from "uuid";

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { AtualizarJogadorDto } from './dtos/atualizar-jogador'
import { CriarJogadorDto } from './dtos/criar-jogador'
import { IJogador } from './interfaces/jogador.interface'

@Injectable()
export class JogadoresService {
  constructor (
    @InjectModel('Jogador') private readonly JogadorModel: Model<IJogador>
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador (jogadorDto: CriarJogadorDto): Promise<IJogador> {
    this.logger.log(`criaJogadorDto: ${jogadorDto}`)
    const { email } = jogadorDto

    const jogadorEncontrado = await this.JogadorModel.findOne({ email })

    if (jogadorEncontrado) {
      throw new BadRequestException(
        `Jogador com e-mail ${email} já cadastrado`
      )
    }

    const jogadorCriado = new this.JogadorModel(jogadorDto)
    return await jogadorCriado.save()
  }

  async atualizarJogador (
    _id: string,
    jogadorDto: AtualizarJogadorDto
  ): Promise<void> {
    this.logger.log(`criaJogadorDto: ${jogadorDto}`)

    const jogadorEncontrado = await this.JogadorModel.findOne({ _id })

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com _id ${_id} não cadastrado`)
    }

    await this.JogadorModel.findOneAndUpdate({ _id }, { $set: jogadorDto })
  }

  async consultarTodosJogadores (): Promise<IJogador[]> {
    return await this.JogadorModel.find()
  }

  async consultarJogadorPorId (_id: string): Promise<IJogador> {
    const jogadorEncontrado = await this.JogadorModel.findOne({ _id })

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`)
    }

    return jogadorEncontrado
  }

  async deletarJogador (_id: string): Promise<any> {
    const jogadorEncontrado = await this.JogadorModel.findOne({ _id })

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`)
    }

    return await this.JogadorModel.deleteOne({ _id })
  }
}
