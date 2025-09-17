import { MatchStatus } from "@prisma/client";

export const generateRoundRobin = (tournamentId: number, partipiants: any[]) => {
    const pairs: any[] = [];

    for (let i = 0; i < partipiants.length; i++) {
        for (let j = i + 1; j < partipiants.length; j++) {
            if (partipiants[i].userId !== partipiants[j].userId) {
                pairs.push({
                    tournamentId: tournamentId,
                    player1Id: partipiants[i].userId,
                    player2Id: partipiants[j].userId,
                    status: 'SCHEDULED' as MatchStatus
                });
            }
        }
    }
    console.log(pairs)
    return pairs;
}