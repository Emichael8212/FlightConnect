import { useState } from 'react';
import { registerUser } from '../../api';
import './Register.css';
import { Link, useNavigate} from 'react-router-dom';
import { useAuthenticationContext } from '../Context/AuthenticationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faUnlock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../Components/Spinner';

export default function Register() {
    // set an initial state for the form to register
    const [setRegisterData, isSetRegisterData] = useState(
        {
            username: '',
            password: '',
            confirmPassword: '',
            email: ''
        },
    );
    // set a state to inform user if they successfully registered
    const [registerMessage, setRegisterMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const {login} = useAuthenticationContext();
    const navigate = useNavigate();
    // Initiate a function that changes the state of the form info to that which the user filled out
    const handleChange = (event) => {
        const {name, value} = event.target;
        isSetRegisterData(prev => ({...prev, [name]: value}));
    };

    const handleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    // handle the submition of the form
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const response = await registerUser(setRegisterData);
        if (response.wasSuccessful) {
            await login({
                username: setRegisterData.username,
                password: setRegisterData.password
            });
            navigate('/preference');
        } else {
            setRegisterMessage(response.error);
            setLoading(false);
        };
    };

    return (
        <section>
            <div className='register-container'>
                <form className='register-form' onSubmit={handleRegisterSubmit}>
                    {loading && <Spinner size={80} overlay={true} />}
                    <h2>Registration</h2>
                    <div className='register-input left-icon'>
                        <label htmlFor='username' className='sr-only'>Username</label>
                        <input
                            id = 'username'
                            name='username'
                            type='text'
                            value={setRegisterData.username}
                            placeholder='Username' onChange={handleChange}
                            required
                        />
                        <FontAwesomeIcon
                            icon={faUser}
                            className='register-icon left'
                        />
                    </div>
                    <div className='register-input left-icon'>
                        <label htmlFor='email' className='sr-only'>Email</label>
                        <input
                            id = 'email'
                            name='email'
                            type='email'
                            value={setRegisterData.email}
                            placeholder='Email'
                            onChange={handleChange}
                            required
                        />
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className='register-icon left'
                        />
                    </div>
                    <div className='register-input'>
                        <label htmlFor='password' className='sr-only'>Password</label>
                        <input
                            id = 'password'
                            name='password'
                            type='password'
                            value={setRegisterData.password}
                            onChange={handleChange}
                            placeholder='Password'
                            required
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faUnlock :faLock}
                            onClick={handleShowPassword}
                            className='register-icon right toggle'
                        />
                    </div>
                    <div className='register-input'>
                        <label htmlFor='confirmPassword' className='sr-only'>Confirm Password</label>
                        <input
                            id = 'confirmPassword'
                            name='confirmPassword'
                            type='password'
                            value={setRegisterData.confirmPassword}
                            onChange={handleChange}
                            placeholder='Confirm Password'
                            required
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faUnlock :faLock}
                            onClick={handleShowPassword}
                            className='register-icon right toggle'
                        />
                    </div>
                        <br />
                    <button
                        className='register-btn'
                        type='submit'
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    <Link to='/auth/login'>
                        <p className='login-redirect'>Back to Login</p>
                    </Link>
                    {registerMessage && <p className='error-msg'>{registerMessage}</p>}
                </form>
            </div>
        </section>
    );
}
