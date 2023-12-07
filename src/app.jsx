import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { Login } from './login/login';
import { About } from './about/about';
import { Scores } from './scores/scores';
import { Difficulty } from './difficulty/difficulty';

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
  }
export default function App() {
  return  (
    <BrowserRouter>
  <div className="app bg-success text-light">
  <header className="container-fluid">
    <nav className="navbar fixed-top navbar-dark">
      <NavLink className="navbar-brand" to=" ">SnakeKing<sup></sup></NavLink>
      <menu className="navbar-nav">
        <li className="nav-item">
            <NavLink className="nav-link active" to=" ">Home</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to="scores">Scores</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link active" to="difficulty">Difficulty</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="about">About</NavLink>
          </li>
      </menu>
    </nav>
  </header>

    <Routes>
    <Route path='/' element={<Login />} exact />
    <Route path='/play' element={<Difficulty />} />
    <Route path='/scores' element={<Scores />} />
    <Route path='/about' element={<About />} />
    <Route path='*' element={<NotFound />} />
    </Routes>


  <footer className="bg-dark text-white-50">
    <div className="container-fluid">
      <span className="text-reset">Author Solon</span>
      <a className="text-reset" href="https://github.com/Solon-B/snake">Source</a>
    </div>
  </footer>

</div>
</BrowserRouter>
);
}