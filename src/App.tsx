import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { selectLogin } from './features/login/loginSlice';
import Lobby from './features/lobby/Lobby';
import Login from './features/login/Login';

interface Message {
  username: string;
  content: string;
  timeMillis: number;
}


const App = () => {

  const login = useAppSelector(selectLogin);
  
  return (
    login.isLoggedIn ? <Lobby></Lobby> : <Login></Login> 
  );
};

export default App;


