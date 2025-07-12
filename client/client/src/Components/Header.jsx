import { Link } from 'react-router-dom';
import Profile from './Profile.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import "./Header.css";

export default function Header() {
  return (
    <header className='header'>
        <div className='header-logo'>
            <FontAwesomeIcon icon={faBars} />
        </div>
        <span className='web-title'>
            Flight Connect
        </span>
        <div className='profile-logo'>
            <Profile />
        </div>

    </header>
  );
}
