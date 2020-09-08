import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  UsePipes,
  ValidationPipe,
  Param,
  Put
} from '@nestjs/common'

import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe'
import { AtualizarJogadorDto } from './dtos/atualizar-jogador'
import { CriarJogadorDto } from './dtos/criar-jogador'
import { IJogador } from './interfaces/jogador.interface'
import { JogadoresService } from './jogadores.service'

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor (private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador (@Body() jogador: CriarJogadorDto): Promise<IJogador> {
    return await this.jogadoresService.criarJogador(jogador)
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador (
    @Body() jogador: AtualizarJogadorDto,
    @Param('_id', ValidacaoParametrosPipe) _id: string
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(_id, jogador)
  }

  @Get()
  async consultarJogadores (): Promise<IJogador[]> {
    return await this.jogadoresService.consultarTodosJogadores()
  }

  @Get('/:_id')
  async consultarJogadorPeloId (
    @Param('_id', ValidacaoParametrosPipe) _id: string
  ): Promise<IJogador> {
    return await this.jogadoresService.consultarJogadorPorId(_id)
  }

  @Delete('/:_id')
  async deletarJogador (
    @Param('_id', ValidacaoParametrosPipe) _id: string
  ): Promise<void> {
    await this.jogadoresService.deletarJogador(_id)
  }
}
