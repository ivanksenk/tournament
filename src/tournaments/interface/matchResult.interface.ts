export enum MatchesStatus {
    SCHEDULED = "SCHEDULED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export interface MatchresulInterface {
    id:number,
    winnerId: number,
    status: MatchesStatus
}