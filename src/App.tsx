import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { selectLogin } from './features/login/loginSlice';
import Lobby from './features/lobby/Lobby';
import Login from './features/login/Login';
import { AuthProvider, RequireAuth } from './Auth';
import {
  Routes,
  Route,
} from "react-router-dom";


const App = () => {
  return (
    <div id='appContainer'>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route
            path="/lobby/*"
            element={
              <RequireAuth>
                <Lobby />
              </RequireAuth>
            }
          />
          <Route
            path="*"
            element={
              <RequireAuth>
                <div> ERROR 404 - PAGE NOT FOUND</div>
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </div>

  );
};

export default App;


