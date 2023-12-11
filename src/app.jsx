import React, { useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { Login } from './login/login';
import { AuthState } from './login/authState';
import { About } from './about/about';
import { Scores } from './scores/scores';
import { Difficulty } from './difficulty/difficulty';
import { Play_hard } from './play_hard/play_hard';
import { Play_medium } from './play_medium/play_medium';
import { Play_easy } from './play_easy/play_easy';

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default function App() {
  const [userName, setUserName] = useState('');
  const [authState, setAuthState] = useState(AuthState.Unauthenticated);

  return (
    <BrowserRouter>
      <div className="app bg-success text-light">
        <header className="container-fluid">
          <nav className="navbar fixed-top navbar-dark">
            <NavLink className="navbar-brand" to=" ">
              SnakeKing<sup></sup>
            </NavLink>
            <menu className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to=" ">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="scores">
                  Scores
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="difficulty">
                  Difficulty
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="about">
                  About
                </NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
            exact
          />
          <Route path='/difficulty' element={<Difficulty />} />
          <Route path='/play_hard' element={<Play_hard />} />
          <Route path='/play_easy' element={<Play_easy />} />
          <Route path='/play_medium' element={<Play_medium />} />
          <Route path='/scores' element={<Scores />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer className="bg-dark text-white-50">
          <div className="container-fluid">
            <span className="text-reset">Author Solon</span>
            <a className="text-reset" href="https://github.com/Solon-B/snake">
              Source
            </a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
