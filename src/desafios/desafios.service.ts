import { Model } from 'mongoose'
import { CategoriasService } from 'src/categorias/categorias.service'
import { JogadoresService } from 'src/jogadores/jogadores.service'

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto'
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto'
import { CriarDesafioDto } from './dtos/criar-desafio.dto'
import { DesafioStatus } from './interfaces/desafio-status.enum'
import { IDesafio, IPartida } from './interfaces/desafio.interface'

@Injectable()
export class DesafiosService {
  constructor (
    @InjectModel('Desafio') private readonly DesafioModel: Model<IDesafio>,
    @InjectModel('Partida') private readonly PartidaModel: Model<IPartida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService
  ) {}

  async criarDesafio (desafioDto: CriarDesafioDto): Promise<IDesafio> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores()

    desafioDto.jogadores.map((jogadorDto) => {
      const jogadorFilter = jogadores.filter(
        (jogador) => String(jogador._id) === String(jogadorDto._id)
      )

      if (jogadorFilter.length === 0) {
        throw new BadRequestException(
          `O id ${jogadorDto._id} não é um jogador`
        )
      }
    })

    const solicitanteEhJogadorDaPartida = desafioDto.jogadores.filter(
      (jogador) => jogador._id === desafioDto.solicitante
    )

    if (solicitanteEhJogadorDaPartida.length === 0) {
      throw new BadRequestException(
        'O solicitante deve ser um jogador da partida'
      )
    }

    const categoriaDoJogador = await this.categoriasService.consultarCategoriaDoJogador(
      desafioDto.solicitante
    )

    if (!categoriaDoJogador) {
      throw new BadRequestException(
        'O solicitante precisa estar cadastrado numa categoria!'
      )
    }

    const desafio = new this.DesafioModel(desafioDto)
    desafio.categoria = categoriaDoJogador.categoria
    desafio.dataHoraSolicitacao = new Date()
    desafio.status = DesafioStatus.PENDENTE

    return await desafio.save()
  }

  async consultarTodosDesafios (): Promise<IDesafio[]> {
    return await this.DesafioModel.find()
      .populate('jogadores')
      .populate('solicitante')
      .populate('partida')
  }

  async consultarDesafioDeUmJogador (_id: any): Promise<IDesafio[]> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores()

    const jogadorFilter = jogadores.filter((jogador) => jogador._id === _id)

    if (jogadorFilter.length === 0) {
      throw new BadRequestException(`O id ${_id} não é um jogador`)
    }

    return await this.DesafioModel.find()
      .where('jogadores')
      .in(_id)
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
  }

  async atualizarDesafio (
    _id: string,
    desafioDto: AtualizarDesafioDto
  ): Promise<void> {
    const desafio = await this.DesafioModel.findOne({ _id })

    if (!desafio) {
      throw new NotFoundException(`Desafio ${_id} não encontrado!`)
    }

    if (desafio.status) {
      desafio.dataHoraResposta = new Date()
    }

    desafio.status = desafioDto.status
    desafio.datahoraDesafio = desafioDto.dataHoraDesafio

    await this.DesafioModel.findOneAndUpdate({ _id }, { $set: desafio })
  }

  async atribuiDesafioPartida (
    _id: string,
    atribuirDesafio: AtribuirDesafioPartidaDto
  ): Promise<void> {
    const desafioEncontrado = await this.DesafioModel.findById(_id)

    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não encontrado`)
    }

    const jogadorFilter = desafioEncontrado.jogadores.filter(
      (jogador) => String(jogador._id) === String(atribuirDesafio.def)
    )

    if (jogadorFilter.length === 0) {
      throw new BadRequestException(
        'O jogador vencedor não faz parte do desafio'
      )
    }

    const partidaCriada = new this.PartidaModel(atribuirDesafio)

    partidaCriada.categoria = desafioEncontrado.categoria
    partidaCriada.jogadores = desafioEncontrado.jogadores

    const resultado = await partidaCriada.save()

    desafioEncontrado.status = DesafioStatus.REALIZADO
    desafioEncontrado.partida = resultado._id

    try {
      await this.DesafioModel.findOneAndUpdate(
        { _id },
        { $set: desafioEncontrado }
      )
    } catch (error) {
      await this.PartidaModel.deleteOne({ _id: resultado._id })
      throw new InternalServerErrorException()
    }
  }

  async deletarDesafio (_id: string): Promise<void> {
    const desafioEncontrado = await this.DesafioModel.findById(_id)

    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não encontrado!`)
    }

    desafioEncontrado.status = DesafioStatus.CANCELADO

    await this.DesafioModel.findOneAndUpdate(
      { _id },
      { $set: desafioEncontrado }
    )
  }
}
