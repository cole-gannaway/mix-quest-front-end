import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectLogin, setLobbyUUID, setUsername, setIsLoggedIn } from './loginSlice';


const Login = () => {
  const dispatch = useAppDispatch();
  const login = useAppSelector(selectLogin);
  
  const username = login.username;
  const lobbyUUID = login.lobbyUUID;

  function handleLogin () {
    dispatch(setIsLoggedIn(true));
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => dispatch(setUsername((e.target.value)))}
          />
        </div>
        <div>
          <label htmlFor="lobbyId">Lobby ID:</label>
          <input
            type="text"
            id="lobbyId"
            value={lobbyUUID}
            onChange={(e) => dispatch(setLobbyUUID(e.target.value))}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
