export interface SongRequestCombinedMessage{
    lobbyUUID : string;
    songUUID : string;
    likeCount : number;
    dislikeCount : number;
}
export interface SongRequestMessage {
    songUUID: string;
    username: string;
    lobbyUUID: string;
    isLike: boolean;
}
