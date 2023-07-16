import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface LoginState {
  username: string;
  lobbyUUID: string;
  isOfflineMode: boolean;
}

const initialState: LoginState = {
  username: "",
  lobbyUUID: "",
  isOfflineMode: true
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
        state.username = action.payload;
    },
    setLobbyUUID: (state, action: PayloadAction<string>) => {
        state.lobbyUUID = action.payload;
    },
    setIsOffline: (state, action: PayloadAction<boolean>) => {
      state.isOfflineMode = action.payload;
    },
  }
});

export const { setUsername, setLobbyUUID} = loginSlice.actions;

export const selectLogin = (state: RootState) => state.login;

export default loginSlice.reducer;
