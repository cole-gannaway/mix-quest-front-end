export interface SongRequestCountByLobbyMessage{
    lobbyUUID : string;
    songUUID : string;
    songCount : string;
}
export interface SongRequestMessage {
    songUUID: string;
    username: string;
    lobbyUUID: string;
}
