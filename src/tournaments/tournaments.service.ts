import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { PrismaService } from 'prisma/prisma.service';
import { generateRoundRobin } from './roundRobin/roundRobin';
import { Prisma, TournamentStatus } from '@prisma/client';
import { getRandomNumber } from 'src/utils/getRandomNumber';
import { MatchesStatus, MatchresulInterface } from './interface/matchResult.interface';



@Injectable()
export class TournamentsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTournamentDto: CreateTournamentDto) {
    return this.prisma.tournament.create({ data: createTournamentDto })
  }

  findAll() {
    return this.prisma.tournament.findMany();
  }
  /**
   * JoinTournament
   * @param tournamentId - id created tournament
   * @param userId - id join user
   * @returns - 200 tournament/user info
   */
  async joinTournament(tournamentId: number, userId: number) {
    const tournament = await this.prisma.tournament.findUnique({ where: { id: tournamentId } });

    if (tournament?.status !== 'UPCOMING') {
      throw new BadRequestException('Cannot join tournament is not upcoming')
    }

    const existParticipiant = await this.prisma.tournamentParticipation.findUnique({
      where: {
        userId_tournamentId: {
          userId,
          tournamentId
        }
      }
    })

    if (existParticipiant) {
      throw new BadRequestException('User already joinded')
    }

    return this.prisma.tournamentParticipation.create({
      data: {
        userId,
        tournamentId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            rating: true
          }
        }
      }
    })
  }


  /**
   * Run tournament
   * @param id - id tournament
   * @returns tournament info + userlist
   */

  async startTournament(id: number) {
    const tournament = await this.prisma.tournament.findUnique({ where: { id: id } });

    if (tournament?.status !== 'UPCOMING') {
      throw new BadRequestException('Tournament already started')
    }

    const tournamentPartipiants = await this.prisma.tournamentParticipation.findMany({
      where: { tournamentId: id },
      omit: {
        id: true,
        finalRank: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            rating: true
          }
        }
      }
    });

    if (tournamentPartipiants.length < 2) {
      throw new BadRequestException('A tournament requires at least 2 participants.')
    }
    const matches = generateRoundRobin(id, tournamentPartipiants)
    await this.prisma.$transaction([
      this.prisma.tournament.update({
        where: { id },
        data: { status: 'ACTIVE' as TournamentStatus }
      }),
      this.prisma.match.createMany({
        data: matches
      })
    ])
    return {
      tournamentId: id,
      status: 'ACTIVE' as TournamentStatus,
      tournamentName: tournament.name,
      tournamentDescription: tournament.description,
      partipiants: tournamentPartipiants
    }
  }

  /**
   * Start Round Robin
   * @param id - id tournament
   * @returns tournament info, user list
   */

  async completeTournament(id: number) {
    const tournament = await this.prisma.tournament.findUnique({ where: { id: id } });

    if (tournament?.status === 'COMPLETED') {
      return await this.prisma.match.findMany({
        where: { tournamentId: id },
      })
    }

    if (tournament?.status !== 'ACTIVE') {
      throw new BadRequestException('Only the tournament that has started can be completed.');
    }

    const tournamentMatches = await this.prisma.match.findMany({ where: { tournamentId: id } });
    const completedMatches: any[] = [];

    for (const match of tournamentMatches) {
      if (match.status !== 'SCHEDULED') {
        continue
      }
      const player1IdResult = getRandomNumber(1, 100);
      const player2IdResult = getRandomNumber(1, 100);
      const matchResult: MatchresulInterface = {
        id: match.id,
        winnerId: player1IdResult > player2IdResult ? match.player1Id : match.player2Id,
        status: 'COMPLETED' as MatchesStatus
      }
      completedMatches.push(matchResult);
    }

    console.log(completedMatches);
    const transactionOperations: Prisma.PrismaPromise<any>[] = [];

    const winsCount = completedMatches.reduce((acc, m) => {
      acc[m.winnerId] = (acc[m.winnerId] || 0) + 1;
      return acc;
    }, {});

    const playersByWins: { [wins: number]: number[] } = {};
    Object.entries(winsCount).forEach(([playerId, wins]) => {
      const winsNum = wins as number;
      if (!playersByWins[winsNum]) {
        playersByWins[winsNum] = [];
      }
      playersByWins[winsNum].push(parseInt(playerId));
    });

    const sortedWins = Object.keys(playersByWins)
      .map(Number)
      .sort((a, b) => b - a);

    const saveRanks: any[] = [];
    let currentRank = 1;
    for (const wins of sortedWins) {
      const players = playersByWins[wins];
      if (players.length === 1) {
        saveRanks.push({
          rank: currentRank,
          playerId: players[0],
          wins: wins
        });
        currentRank++;
      } else {
        const playOffResults: { [playerId: number]: number } = {};
        players.forEach(playerId => {
          playOffResults[playerId] = 0;
        });
        for (let i = 0; i < players.length; i++) {
          for (let j = i + 1; j < players.length; j++) {
            const player1Id = players[i];
            const player2Id = players[j];
            const player1Result = getRandomNumber(1, 100);
            const player2Result = getRandomNumber(1, 100);
            const winnerId = player1Result > player2Result ? player1Id : player2Id;
            playOffResults[winnerId]++;
          }
        }
        const sortedPlayOff = players
          .map(playerId => ({
            playerId,
            playoffWins: playOffResults[playerId],
            totalWins: wins
          }))
          .sort((a, b) => b.playoffWins - a.playoffWins || a.playerId - b.playerId);
        let groupRank = currentRank;
        let previousPlayoffWins: number | null = null;

        for (let i = 0; i < sortedPlayOff.length; i++) {
          const player = sortedPlayOff[i];

          if (previousPlayoffWins !== null && player.playoffWins !== previousPlayoffWins) {
            groupRank = currentRank + i;
          }

          saveRanks.push({
            rank: groupRank,
            playerId: player.playerId,
            wins: player.totalWins,
            playoffWins: player.playoffWins
          });

          previousPlayoffWins = player.playoffWins;
        }

        currentRank += players.length;
      }
    }

    saveRanks.sort((a, b) => a.rank - b.rank || a.playerId - b.playerId);
    console.log('Финальный рейтинг:');
    console.log(saveRanks);
    completedMatches.forEach(matchResult => {
      transactionOperations.push(
        this.prisma.match.update({
          where: { id: matchResult.id },
          data: {
            winnerId: matchResult.winnerId,
            status: 'COMPLETED',
            playedAt: new Date().toISOString()
          }
        })
      )

      transactionOperations.push(
        this.prisma.user.update({
          where: { id: matchResult.winnerId },
          data: { rating: { increment: 5 } }
        })
      )
    })

    transactionOperations.push(
      this.prisma.tournament.update({
        where: { id },
        data: { status: 'COMPLETED' as TournamentStatus }
      })
    )

    saveRanks.forEach(user => {
      console.log(user);
      transactionOperations.push(this.prisma.tournamentParticipation.update({
        where: {
          userId_tournamentId: {
            userId: user.playerId,
            tournamentId: id
          }
        },
        data: { finalRank: user.rank }
      }))
    })

    await this.prisma.$transaction(transactionOperations);
    return {
      tournamentId: id,
      status: "COMPLETED" as TournamentStatus,
      userRanks: saveRanks
    }

  }

  findOne(id: number) {
    return this.prisma.tournament.findUnique({
      where: { id: id }
    })
  }

}
