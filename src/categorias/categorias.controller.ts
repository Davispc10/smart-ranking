import {
  Controller,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Put
} from '@nestjs/common'

import { CategoriasService } from './categorias.service'
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto'
import { CriarCategoriaDto } from './dtos/criar-categoria.dto'
import { ICategoria } from './interfaces/categoria.interface'

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor (private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria (@Body() categoria: CriarCategoriaDto): Promise<ICategoria> {
    return await this.categoriasService.criarCategoria(categoria)
  }

  @Get()
  async consultarCategorias (): Promise<ICategoria[]> {
    return await this.categoriasService.consultarTodascategorias()
  }

  @Get('/:categoria')
  async consultarCategoriaPorId (
    @Param('categoria') categoria: string
  ): Promise<ICategoria> {
    return await this.categoriasService.consultarCategoriaPeloId(categoria)
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async atualizarCategoria (
    @Body() categoriaDto: AtualizarCategoriaDto,
    @Param('categoria') categoria: string
  ): Promise<void> {
    await this.categoriasService.atualizarCategoria(categoria, categoriaDto)
  }

  @Post('/:categoria/jogadores/:idJogador')
  async atribuirCategoriaJogador (@Param() params: string[]): Promise<void> {
    return await this.categoriasService.atribuirCategoriaJogador(params)
  }
}
