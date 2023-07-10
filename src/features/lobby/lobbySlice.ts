import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SongRequestCountByLobbyMessage } from '../../model/Messages';

export interface Song {
  uuid: string;
  embededUrl: string;
  likes: number;
  dislikes: number;
}

export interface LobbyState {
  songs: Song[]
  userCount: number;
}

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
    const embededUrl = createEmbeddedURL(uuid);
    return embededUrl;
  } else {
    return null;
  }
}

function createEmbeddedURL(uuid:string){
  const embededUrl = "https://open.spotify.com/embed/track/" + uuid;
  return embededUrl;
}

export function createNewSong(url: string){
  const uuid = parseUUIDFromURL(url);
  const embededUrl = convertURLToEmbeddedURL(url);
  if (uuid !== null && embededUrl !== null){
    const newSong : Song = {
      uuid: uuid,
      embededUrl: embededUrl,
      likes: 0,
      dislikes: 0
    }
    return newSong;
  }
  else return null;
}

export function createNewSongUUID(uuid: string){
  const newSong : Song = {
    uuid: uuid,
    embededUrl: createEmbeddedURL(uuid),
    likes: 0,
    dislikes: 0
  }
  return newSong;
}

const initialState: LobbyState = {
    songs: [],
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
    bulkAddSongRequestAndDislikes: (state, action: PayloadAction<{songRequests: SongRequestCountByLobbyMessage[], songRequestDislikes: SongRequestCountByLobbyMessage[]}>) => {
      const songRequests = action.payload.songRequests;
      const songRequestDislikes = action.payload.songRequestDislikes;
      const songs : Song[] = []

      songRequests.forEach((songRequest) => {
        // create new songs
        const songUUID = songRequest.songUUID;
        const newSong = createNewSongUUID(songUUID);
        // adjust number of likes
        newSong.likes = songRequest.songCount;
        songs.push(newSong);
      })

      songRequestDislikes.forEach((songRequestDislike) => {
        const foundSoung = songs.find((song) => song.uuid === songRequestDislike.songUUID);
        // adjust number of dislikes
        if (foundSoung) foundSoung.dislikes = songRequestDislike.songCount;
      })

      state.songs = songs;
    },
    handleSongRequestUpdate: (state, action: PayloadAction<SongRequestCountByLobbyMessage[]>) => {
      const songRequests = action.payload;
      songRequests.forEach((songRequest, i) => {
        const songUUID = songRequest.songUUID;
        const foundSoung = state.songs.find((song) => song.uuid === songUUID);
        if (foundSoung) foundSoung.likes = songRequest.songCount;
        else {
          const newSong = createNewSongUUID(songUUID);
          newSong.likes = 1;
          state.songs.push(newSong);
        }
      })
      // trigger rerender
      state.songs = [...state.songs]
    },
    handleSongRequestDislikeUpdate: (state, action: PayloadAction<SongRequestCountByLobbyMessage[]>) => {
      const songRequestDislikes = action.payload;
      songRequestDislikes.forEach((songRequestDislikes, i) => {
        const songUUID = songRequestDislikes.songUUID;
        const foundSoung = state.songs.find((song) => song.uuid === songUUID);
        if (foundSoung) foundSoung.dislikes = songRequestDislikes.songCount;
      })
      // trigger rerender
      state.songs = [...state.songs]
    }
  }
});

export const { setUserCount, addSong, likeSong, bulkAddSongRequestAndDislikes, handleSongRequestUpdate, handleSongRequestDislikeUpdate } = lobbySlice.actions;

export const selectLobby = (state: RootState) => state.lobby;

export default lobbySlice.reducer;
