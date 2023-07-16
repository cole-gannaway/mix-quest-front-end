import React from 'react';
import Lobby from './features/lobby/Lobby';
import Login from './features/login/Login';
import { AuthProvider, RequireAuth } from './Auth';
import {
  Routes,
  Route,
} from "react-router-dom";

const App = () => {
  return (
    <div id='appContainer' className="text-white">
      <div className='mx-auto table'>
        <h2 className='text-3xl table-cell'>Mix Quest</h2>
        <div className='table-cell h-6 w-6'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" id="DiskJockey">
              <path d="M26.125,6.125c-0.004-0.001-0.008,0.001-0.012,0c-0.004-0.001-0.006-0.003-0.01-0.004C25.71,6.04,25.35,6,25,6h-2
                  c-2.757,0-5,2.243-5,5v1v3c0,2.757,2.243,5,5,5h2c2.757,0,5-2.243,5-5v-3v-1C30,8.655,28.406,6.651,26.125,6.125z">
              </path>
              <path d="M31,11c-0.553,0-1-0.448-1-1V8c0-3.309-2.691-6-6-6s-6,2.691-6,6v2c0,0.552-0.447,1-1,1s-1-0.448-1-1V8
                    c0-4.411,3.589-8,8-8s8,3.589,8,8v2C32,10.552,31.553,11,31,11z"></path>
              <path
                  d="M17 18c1.654 0 3-1.346 3-3v-3c0-1.654-1.346-3-3-3s-3 1.346-3 3v3C14 16.654 15.346 18 17 18zM31 18c1.654 0 3-1.346 3-3v-3c0-1.654-1.346-3-3-3s-3 1.346-3 3v3C28 16.654 29.346 18 31 18z">
              </path>
              <path d="M16,29.244V32h16v-2.756l9.116-9.125c0.571-0.566,0.887-1.318,0.887-2.119c0-0.801-0.316-1.555-0.881-2.113
                  c-1.135-1.147-3.124-1.133-4.229-0.014L30.594,22H17.406l-6.284-6.113c-1.135-1.147-3.118-1.139-4.235-0.009
                  c-0.573,0.567-0.89,1.32-0.89,2.122s0.316,1.555,0.886,2.117L16,29.244z">
              </path>
              <circle cx="33" cy="41" r="2"></circle>
              <circle cx="15" cy="41" r="2"></circle>
              <path d="M45.949,46.684l-4-12C41.812,34.275,41.431,34,41,34H7c-0.431,0-0.813,0.275-0.949,0.684l-4,12
                  c-0.102,0.305-0.05,0.641,0.138,0.901S2.679,48,3,48h42c0.321,0,0.623-0.154,0.811-0.415S46.05,46.988,45.949,46.684z M15,45
                  c-2.209,0-4-1.791-4-4c0-2.209,1.791-4,4-4c2.209,0,4,1.791,4,4C19,43.209,17.209,45,15,45z M33,45c-2.209,0-4-1.791-4-4
                  c0-2.209,1.791-4,4-4c2.209,0,4,1.791,4,4C37,43.209,35.209,45,33,45z">
              </path>
          </svg>
        </div>
      </div>
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


