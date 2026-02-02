import logo from '../images/logo.png';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img className='logo2' src={logo} alt="Escrow Ease Logo" />
      </div>
      <div className="menu">
        <ul>
          <li><NavLink className="btn" to="/">HOME</NavLink></li>
          <li><NavLink className="btn" to="/list">FIND A CAR</NavLink></li>
          <li><NavLink className="btn" to="/about">ABOUT</NavLink></li>
          <li><NavLink className="btn" to="/contact">CONTACT US</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}







