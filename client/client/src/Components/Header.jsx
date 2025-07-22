import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Profile from './Profile.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import "./Header.css";
import ToolTip from './TooTip.jsx';
import NavBar from './NavBar.jsx';

export default function Header() {
    const [showNav, setShowNav] = useState(false);
    const navigate = useNavigate();

    const handleEmailClick = () => {
        // Handle email click logic here
        navigate('/auth/connect');
    };

  return (
    <header className='header'>
        <div className='header-logo'>
            <FontAwesomeIcon
                icon={faBars}
                onClick={() => setShowNav(true)}
            />
        </div>
        <h1 className='web-title'>
            Flight Connect
        </h1>
        <ToolTip
            text={'Worried about your loved ? \nWe gotcha You!\nClick to Connect'}
            position='bottom'
        >
            <FontAwesomeIcon
                icon={faEnvelope}
                onClick={handleEmailClick}
                className='email-icon'
            />
        </ToolTip>
        <div className='profile-logo'>
            <Profile />
        </div>
        <NavBar openNav={showNav} onclose={() => setShowNav(false)}/>
    </header>
  );
}
