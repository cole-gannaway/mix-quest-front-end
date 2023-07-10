import axios from 'axios';
import { SongRequestCountByLobbyMessage, SongRequestMessage } from '../model/Messages';

export async function getSessionCount(hostname : string, lobbyUUID: string) : Promise<number | null> {
    let count = null;
    try {
        const response = await axios.get("http://" + hostname + ":8080/getSessions/" + lobbyUUID);
        if (response.status === 200){
            const result : number = response.data
            count = result;
        }
    } catch (e){
        console.error(e);
    }
    return count;
}

export async function getSongRequestsByLobby(hostname : string, lobbyUUID : string) : Promise<SongRequestCountByLobbyMessage[] | null> {
    let retVal : SongRequestCountByLobbyMessage[] | null = null;
    try {
        const response = await axios.get("http://" + hostname + ":8080/getSongRequestsByLobby/" + lobbyUUID);
        if (response.status === 200){
            const result : SongRequestCountByLobbyMessage[] = response.data
            retVal = result;
        }
    } catch (e){
        console.error(e);
    }
    return retVal;
}

export async function getSongRequestDislikesByLobby(hostname : string, lobbyUUID : string) : Promise<SongRequestCountByLobbyMessage[] | null> {
    let retVal : SongRequestCountByLobbyMessage[] | null = null;
    try {
        const response = await axios.get("http://" + hostname + ":8080/getSongRequestDislikesByLobby/" + lobbyUUID);
        if (response.status === 200){
            const result : SongRequestCountByLobbyMessage[] = response.data
            retVal = result;
        }
    } catch (e){
        console.error(e);
    }
    return retVal;
}

export async function sendSongRequest(hostname : string, message : SongRequestMessage) : Promise<Boolean | null> {
    let retVal = null;
    try {
        const response = await axios.put("http://" + hostname + ":8080/addSongRequest", message);
        if (response.status === 200){
            const result : boolean = response.data
            retVal = result;
        }
    } catch (e){
        console.error(e);
    }
    return retVal;
}

export async function sendSongRequestDislike(hostname : string, message : SongRequestMessage) : Promise<Boolean | null> {
    let retVal = null;
    try {
        const response = await axios.put("http://" + hostname + ":8080/addSongRequestDislike", message);
        if (response.status === 200){
            const result : boolean = response.data
            retVal = result;
        }
    } catch (e){
        console.error(e);
    }
    return retVal;
}