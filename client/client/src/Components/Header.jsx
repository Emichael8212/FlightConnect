import { Link } from 'react-router-dom';
import "./Header.css";

export default function Header() {
  return (
    <header className='header'>
        <div className='header-logo'>
            LOGO
        </div>
        <span className='web-title'>
            Flight Connect
        </span>
        <div className='profile-logo'>
            Profile Avatar
        </div>
        <nav className='header-nav'>
            <a href='/' className='header-nav-link'>Home</a>
            <a href='/Flights' className='header-nav-link'>About</a>
        </nav>
    </header>
  )
}
