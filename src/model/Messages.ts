export interface SongRequestCountByLobbyMessage{
    lobbyUUID : string;
    songUUID : string;
    songCount : number;
}
export interface SongRequestMessage {
    songUUID: string;
    username: string;
    lobbyUUID: string;
}
