import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface LoginState {
  username: string;
  lobbyUUID: string;
  isLoggedIn: boolean;
  isOfflineMode: boolean;
}

const initialState: LoginState = {
  username: "",
  lobbyUUID: "",
  isLoggedIn: false,
  isOfflineMode: false
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
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
        state.isLoggedIn = action.payload
    }
  }
});

export const { setUsername, setLobbyUUID, setIsLoggedIn} = loginSlice.actions;

export const selectLogin = (state: RootState) => state.login;

export default loginSlice.reducer;
