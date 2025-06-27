import { loginUser } from '../../api';
import './Login.css'
import { useState } from 'react'
import { Link } from 'react-router-dom';

export default function Login() {

    const [setLoginData, isSetLoginData] = useState(
        {
            username: "",
            password: ""
        }
    );

    const [loginMessage, setLoginMessage] = useState("");

    const handleLoginChange = (event) => {
        const {name, value} = event.target;
        isSetLoginData(prev => ({...prev, [name]: value}))
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
                const res = await loginUser(setLoginData);
                console.log("meee", res)
                setLoginMessage(res.data.loginMessage);
        }   catch (error) {
                setLoginMessage(res.error);
        }
    };


    return (
        <div>
            <form className='login-form' onSubmit={handleLoginSubmit}>
                <h2>LoGIN</h2>
                <label htmlFor="username">UserName:</label>
                <input id="username" type="text" name="username" 
                    value={setLoginData.username} placeholder="immanuel" onChange={handleLoginChange}/>
                <br />

                <label htmlFor="password">Password:</label>
                <input id="password" type="password" name="password" 
                    value={setLoginData.password} onChange={handleLoginChange}/>
                <br />

                <button className='loginBtn'>Login</button>

                <Link to="/auth/register"><p>Register Here</p></Link>
                
            </form>
        </div>
    )
}