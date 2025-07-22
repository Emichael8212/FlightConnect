import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useAuthenticationContext } from '../Context/AuthenticationContext';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuthenticationContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle menu open/closed
  const handleToggle = () => setIsOpen(open => !open);

  // Close when focus leaves the entire container
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  // Close on Escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const goAndClose = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div
      className='profile-container'
      tabIndex={0}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        className='profile-icon'
        aria-haspopup='menu'
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <FontAwesomeIcon icon={faCircleUser} />
      </button>

      {isOpen && (
        <div className='profile-dropdown' role='menu'>
          <div className='profile-header'>
            <p className='user-name'>{user.username}</p>
            <p className='user-email'>{user.email}</p>
          </div>
          <button role='menuitem' onClick={() => goAndClose('/tracked-flights')}>
            Tracked Flights
          </button>
          <button role='menuitem' onClick={() => goAndClose('/connect')}>
            <FontAwesomeIcon icon={faEnvelope} /> Send Message
          </button>
          <button role='menuitem' onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}
