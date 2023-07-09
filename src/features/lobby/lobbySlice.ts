import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Song {
  uuid: string;
  url: string;
  likes: number;
  dislikes: number;
}

export interface LobbyState {
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

export function parseUUIDFromURL(url: string): string | null {
  const uuid = url.split("https://open.spotify.com/track/")[1]?.split("?")[0];

  const trackIdMatch = url.match("https:\/\/open\.spotify\.com\/track\/([^?]+)");
  if (trackIdMatch && trackIdMatch[1]) {
    return trackIdMatch[1];
  } else {
    return null;
  }
}

export function convertURLToEmbeddedURL(url: string): string | null {
  const uuid = parseUUIDFromURL(url);
  if (uuid) {
    const embededUrl = `https://open.spotify.com/embed/track/${uuid}?utm_source=generator`;
    return embededUrl;
  } else {
    return null;
  }
}

export function createNewSong(url: string){
  const uuid = parseUUIDFromURL(url);
  const embededUrl = convertURLToEmbeddedURL(url);
  if (uuid !== null && embededUrl !== null){
    const newSong : Song = {
      uuid: uuid,
      url: embededUrl,
      likes: 0,
      dislikes: 0
    }
    return newSong;
  }
  else return null;
}

const songs : Song[] = [];
urls.forEach((url) => {
  const song = createNewSong(url);
  if (song) songs.push(song);
})
console.log(songs);

const initialState: LobbyState = {
    songs: songs,
    userCount: 1
};

export const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
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

export const { setUserCount, addSong, likeSong } = lobbySlice.actions;

export const selectLobby = (state: RootState) => state.lobby;

export default lobbySlice.reducer;
