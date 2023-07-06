import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectLogin, setLobbyUUID, setUsername } from './loginSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth';


const Login = () => {
  const dispatch = useAppDispatch();
  const login = useAppSelector(selectLogin);
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();
  let from : string = location.state?.from?.pathname || "/";

  useEffect(() => {
    const lobbyUUIDFromURL : string = from.split("/")[2];
    dispatch(setLobbyUUID(lobbyUUIDFromURL));
  }, [from])

  

  const username = login.username;
  const lobbyUUID = login.lobbyUUID;

  

  function handleLogin (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    auth.signin(username, () => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    });
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
