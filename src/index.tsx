import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <Provider store={store}>
      <BrowserRouter>
        <video playsInline={true} autoPlay={true} loop={true} muted={true} className="fixed -z-10 w-auto min-w-full min-h-full max-w-none">
          <source src="videos/yellow-flame.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div id='myLayover'></div>
        <App />
      </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
