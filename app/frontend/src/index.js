import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainView from './page/mainView';
import Report from './page/report';
import 'mapbox-gl/dist/mapbox-gl.css';
import DelReport from './page/delreport';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <MainView />
  },
  {
    path: "/unauth",
    element: <h1>Unauthorized, please login.</h1>
  },
  {
    path: "/report",
    element: <Report />
  },
  // {
  //   path: "/delreport",
  //   element: <DelReport />
  // }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
