import './Login.css'
import { useState } from 'react'

export default function Login() {

    return (
        <div>
            <form className='login-form'>
                <label htmlFor="email">Email:</label>
                <input id="email" type="text" name="email" placeholder="immanuel@meta.com" />
                <br />

                <label htmlFor="password">Password:</label>
                <input id="password" type="password" name="password"/>
                <br />

                <button>Login</button>

                <p>Forgot password?</p>
                <p>SignUp here</p>
            </form>
        </div>
    )
}