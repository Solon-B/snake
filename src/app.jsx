import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { Login } from './login/login';


export default function App() {
  return  (
  <div className="app bg-success text-light">
  <header className="container-fluid">
    <nav className="navbar fixed-top navbar-dark">
      <a className="navbar-brand" href="index.html">SnakeKing<sup></sup></a>
      <menu className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link active" href="index.html">Home</a>
        </li>
      </menu>
    </nav>
  </header>

<Login />

  <footer className="bg-dark text-white-50">
    <div className="container-fluid">
      <span className="text-reset">Author Solon</span>
      <a className="text-reset" href="https://github.com/Solon-B/snake">Source</a>
    </div>
  </footer>
  

</div>
);
}