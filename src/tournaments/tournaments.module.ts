import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { PrismaService } from 'prisma/prisma.service';


@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService,PrismaService],
})
export class TournamentsModule {}
