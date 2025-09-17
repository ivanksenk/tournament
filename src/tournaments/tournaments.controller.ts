import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseTournamentDto } from './dto/responce-tournament.dto';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) { }

  @ApiOperation({ summary: 'Создать новый турнир' })
  @ApiResponse({
    status: 200,
    description: 'Созданный турнир',
    type: ResponseTournamentDto
  })
  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @ApiOperation({ summary: 'Список всех турниров' })
  @ApiResponse({
    status: 200,
    description: 'Список турниров',
    type: [ResponseTournamentDto]
  })
  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @ApiOperation({ summary: 'Информация о турнире' })
  @ApiResponse({
    status: 200,
    description: 'Информация о турнире',
    type: ResponseTournamentDto
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tournamentsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Присоединиться к турниру' })
  @Post(':id/join/:userId')
  joinTournament(@Param('id') id: number, @Param('userId') userId: number) {
    return this.tournamentsService.joinTournament(+id, +userId);
  }

  @ApiOperation({ summary: 'Запустить турнир' })
  @Patch(':id/start')
  startTournament(@Param('id') id: number) {
    return this.tournamentsService.startTournament(+id)
  }

  @ApiOperation({ summary: 'Сыграть турнир' })
  @Patch(':id/complete')
  completeTournament(@Param('id') id: number) {
    return this.tournamentsService.completeTournament(+id)
  }

}
