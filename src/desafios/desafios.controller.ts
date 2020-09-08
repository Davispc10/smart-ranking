import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Param,
  Put,
  Delete
} from '@nestjs/common'

import { DesafiosService } from './desafios.service'
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto'
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto'
import { CriarDesafioDto } from './dtos/criar-desafio.dto'
import { IDesafio } from './interfaces/desafio.interface'
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validation'

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor (private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio (@Body() desafio: CriarDesafioDto): Promise<IDesafio> {
    return await this.desafiosService.criarDesafio(desafio)
  }

  @Get()
  async consultarDesafio (): Promise<IDesafio[]> {
    return await this.desafiosService.consultarTodosDesafios()
  }

  @Get('/:_id')
  async consultarDesafioPorId (@Param('_id') id: string): Promise<IDesafio[]> {
    return await this.desafiosService.consultarDesafioDeUmJogador(id)
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarDesafio (
    @Body(DesafioStatusValidacaoPipe) desafio: AtualizarDesafioDto,
    @Param('_id') id: string
  ): Promise<void> {
    await this.desafiosService.atualizarDesafio(id, desafio)
  }

  @Post('/:desafio/partida')
  @UsePipes(ValidationPipe)
  async atribuirDesafioPartida (
    @Body() atribuicaoDesafioPartida: AtribuirDesafioPartidaDto,
    @Param('desafio') _id: string
  ): Promise<void> {
    return await this.desafiosService.atribuiDesafioPartida(
      _id,
      atribuicaoDesafioPartida
    )
  }

  @Delete('/:_id')
  async cancelarDesafio (@Param('id') id: string): Promise<void> {
    await this.desafiosService.deletarDesafio(id)
  }
}
