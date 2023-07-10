import React, { useEffect } from 'react';
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
  }, [from, dispatch])

  

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
      // navigate(from, { replace: true });
      navigate("/lobby/" + lobbyUUID);

    });
  };

  return (
    <div>
      <div className='h-8'></div>
      <h1 className="text-2xl text-black">
          Login
      </h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => dispatch(setUsername((e.target.value)))}
            className="p-2 m-2 border border-black rounded border-radius-2"
          />
        </div>
        <div>
          <label htmlFor="lobbyId">Lobby ID:</label>
          <input
            type="text"
            id="lobbyId"
            value={lobbyUUID}
            onChange={(e) => dispatch(setLobbyUUID(e.target.value))}
            className="p-2 m-2 border border-black rounded border-radius-2"
          />
        </div>
        <button type="submit" className='p-4 border border-black rounded border-radius-2'>Login</button>
      </form>
    </div>
  );
};

export default Login;
