import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Message {
    username: string;
    content: string;
    timeMillis: number;
}

export interface LobbyState {
  messages: Message[];
  userCount: number;
}

const initialState: LobbyState = {
    messages: [],
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
  }
});

export const { addMessage, deleteAllMessages, setUserCount } = lobbySlice.actions;

export const selectLobby = (state: RootState) => state.lobby;

export default lobbySlice.reducer;
