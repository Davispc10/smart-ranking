/* eslint-disable dot-notation */
import { Model } from 'mongoose'
import { JogadoresService } from 'src/jogadores/jogadores.service'

import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto'
import { CriarCategoriaDto } from './dtos/criar-categoria.dto'
import { ICategoria } from './interfaces/categoria.interface'

@Injectable()
export class CategoriasService {
  constructor (
    @InjectModel('Categoria')
    private readonly CategoriaModel: Model<ICategoria>,
    private readonly jogadoresService: JogadoresService
  ) {}

  async criarCategoria (categoriaDto: CriarCategoriaDto): Promise<ICategoria> {
    const { categoria } = categoriaDto

    const categoriaEncontrada = await this.CategoriaModel.findOne({
      categoria
    })

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada!`)
    }

    const categoriaCriada = new this.CategoriaModel(categoriaDto)

    return await categoriaCriada.save()
  }

  async consultarTodascategorias (): Promise<ICategoria[]> {
    return await this.CategoriaModel.find().populate('jogadores')
  }

  async consultarCategoriaPeloId (categoria: string): Promise<ICategoria> {
    const categoriaEncontrada = await this.CategoriaModel.findOne({
      categoria
    })

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada!`)
    }

    return categoriaEncontrada
  }

  async consultarCategoriaDoJogador (idJogador: any): Promise<ICategoria> {
    const categoriaEncontrada = await this.CategoriaModel.findOne()
      .where('jogadores')
      .in(idJogador)

    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `Categoria com Jogador ${idJogador} não encontrada!`
      )
    }

    return categoriaEncontrada
  }

  async atualizarCategoria (
    categoria: string,
    categoriaDto: AtualizarCategoriaDto
  ): Promise<void> {
    const categoriaEncontrada = await this.CategoriaModel.findOne({
      categoria
    })

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada!`)
    }

    await this.CategoriaModel.findOneAndUpdate(
      { categoria },
      { $set: categoriaDto }
    )
  }

  async atribuirCategoriaJogador (params: string[]): Promise<void> {
    const categoria = params['categoria']
    const idJogador = params['idJogador']

    const categoriaEncontrada = await this.CategoriaModel.findOne({
      categoria
    })

    const jogadorCadastradoCategoria = await this.CategoriaModel.find({
      categoria
    })
      .where('jogadores')
      .in(idJogador)

    await this.jogadoresService.consultarJogadorPorId(idJogador)

    if (!categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} não encontrada!`)
    }

    if (jogadorCadastradoCategoria.length > 0) {
      throw new BadRequestException(
        `Jogador ${idJogador} já cadastrado na Categoria ${categoria}`
      )
    }

    categoriaEncontrada.jogadores.push(idJogador)

    await this.CategoriaModel.findOneAndUpdate(
      { categoria },
      { $set: categoriaEncontrada }
    )
  }
}
