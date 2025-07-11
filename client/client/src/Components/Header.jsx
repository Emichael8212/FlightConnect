import { useNavigate } from 'react-router-dom';
import Profile from './Profile.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import "./Header.css";

export default function Header() {
    const navigate = useNavigate();

    const handleEmailClick = () => {
        // Handle email click logic here
        navigate('/auth/connect');
    }

  return (
    <header className='header'>
        <div className='header-logo'>
            <FontAwesomeIcon icon={faBars} />
        </div>
        <span className='web-title'>
            Flight Connect
        </span>
        <div>
            <FontAwesomeIcon icon={faEnvelope} onClick={handleEmailClick}/>
        </div>
        <div className='profile-logo'>
            <Profile />
        </div>

    </header>
  )
}
