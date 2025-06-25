import { loginUser } from '../../api';
import './Login.css'
import { useState } from 'react'

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
        event.preventDefault;

        try {
                const res = await loginUser(formData);
                setLoginMessage(res.data.registerMessage);
        }   catch (error) {
                setLoginMessage(res.error);
        }
    };


    return (
        <div>
            <form className='login-form'>
                <label htmlFor="username">UserName:</label>
                <input id="username" type="text" name="username" 
                    value={setLoginData.username} placeholder="immanuel" onChange={handleLoginChange}/>
                <br />

                <label htmlFor="password">Password:</label>
                <input id="password" type="password" name="password" 
                    value={setLoginData.password} onChange={handleLoginChange}/>
                <br />

                <button>Login</button>

                <p>Forgot password?</p>
                <h1>Register here</h1>
            </form>
        </div>
    )
}