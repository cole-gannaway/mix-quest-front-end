import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Message {
    username: string;
    content: string;
    timeMillis: number;
}

export interface Song {
  uuid: string;
  url: string;
  likes: number;
  dislikes: number;
}

export interface LobbyState {
  messages: Message[];
  songs: Song[]
  userCount: number;
}


const urls : string[] = [
  "https://open.spotify.com/track/221qmpQeBNV87sUjQeUTVH?si=2572d82f1b494e4c",
  "https://open.spotify.com/track/0ESJlaM8CE1jRWaNtwSNj8?si=d8b787e0869f490e",
  "https://open.spotify.com/track/3WcC6NH9J77xPEvj1SOL7z?si=e9dc73cf342144f4",
  "https://open.spotify.com/track/3aQem4jVGdhtg116TmJnHz?si=455dc5bf563e4024",
  "https://open.spotify.com/track/4SZepBIPDRwPaHIjAKwRDb?si=59abc6814b714956"
]

export function parseUUIDFromURL(url : string){
  const uuid = url.split("https://open.spotify.com/track/")[1].split("?")[0];
  return uuid;
}

export function convertURLToEmbeddedURL(url : string){
  const embededUrl = "https://open.spotify.com/embed/track/" + parseUUIDFromURL(url) + "?utm_source=generator"
  return embededUrl;
}

export function createNewSong(url: string){
  const newSong : Song = {
    uuid: parseUUIDFromURL(url),
    url: convertURLToEmbeddedURL(url),
    likes: 0,
    dislikes: 0
  }
  return newSong;
}

const initialState: LobbyState = {
    messages: [],
    songs: urls.map((url) => createNewSong(url)),
    userCount: 1
};

export const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
        state.messages = state.messages.concat(action.payload);
    },
    deleteAllMessages: (state) => {
        state.messages = []
    },
    setUserCount: (state, action: PayloadAction<number>) => {
      state.userCount = action.payload;
    },
    addSong: (state, action: PayloadAction<Song>) => {
      state.songs = state.songs.concat(action.payload);
    },
    likeSong: (state, action: PayloadAction<string>) => {
      const songUUID = action.payload;
      const song = state.songs.find((song) => song.uuid === songUUID);
      if (song) song.likes = song.likes + 1;
    },
  }
});

export const { addMessage, deleteAllMessages, setUserCount, addSong, likeSong } = lobbySlice.actions;

export const selectLobby = (state: RootState) => state.lobby;

export default lobbySlice.reducer;
