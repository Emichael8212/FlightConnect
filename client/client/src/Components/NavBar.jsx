import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar({ openNav, onclose}) {
    return (
        <>
            <div
                className={`navbar-overlay ${openNav ? 'show' : ''}`}
                onClick={onclose}
            />
            <nav className={`navbar ${openNav ? 'open' : ''}`}>
                <button className='navbar-close' onClick={onclose}>&times;</button>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/auth/connect'>Connect</Link></li>
                    <li><Link to='/tracked-flights'>Saved Tracks</Link></li>
                    <li><Link to='/hotels'>Hotels</Link></li>
                    <li><Link to='/restaurants'>Restaurants</Link></li>
                    <li><Link to='/things-to-do'>Attractions</Link></li>
                </ul>
            </nav>
        </>
    );
}
