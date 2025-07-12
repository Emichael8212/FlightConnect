import { useState } from "react";
import { registerUser } from "../../api";
import "./Register.css";
import { Link, useNavigate} from "react-router-dom";


export default function Register() {

    // set an initial state for the form to register
    const [setRegisterData, isSetRegisterData] = useState(
        {
            username: "",
            password: "",
            confirmPassword: "",
            email: ""
        },
    );
    // set a state to inform user if they successfully registered
    const [registerMessage, setRegisterMessage] = useState("");

    const navigate = useNavigate();
    // Initiate a function that changes the state of the form info to that which the user filled out
    const handleChange = (event) => {
        const {name, value} = event.target;
        isSetRegisterData(prev => ({...prev, [name]: value}));
    };
    // handle the submition of the form
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();

        const response = await registerUser(setRegisterData);
        if (response.wasSuccessful) {
            navigate("/auth/login");
        } else {
            setRegisterMessage(response.error);
        };
    };

    return (
        <section>
            <div className="form-container">
                <form className="register-form" onSubmit={handleRegisterSubmit}>
                    <h2>ReGister</h2>

                    <label htmlFor="username" >Username:</label>
                    <input id="username" type="text" value={setRegisterData.username} name="username"
                        placeholder="Messi" onChange={handleChange}
                        required/>
                    <br />

                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" value={setRegisterData.password}
                        name="password" onChange={handleChange}
                        required/>
                    <br />

                    <label htmlFor="confirmPassword">Comfirm Password:</label>
                    <input id="confirmPassword" type="password" value={setRegisterData.confirmPassword}
                        name="confirmPassword" onChange={handleChange}
                        required/>
                    <br />

                    <label htmlFor="email">Email:</label>
                    <input id="email" type="text" name="email" value={setRegisterData.email}
                        placeholder="immanuel@meta.com" onChange={handleChange}
                        required/>
                    <br />

                    <button type="submit">Register</button>

                    <Link to="/auth/login">
                        <p className="loginRedirect">Back to Login</p>
                    </Link>


                    {registerMessage && <p>{registerMessage}</p>}

                </form>
            </div>
        </section>
    );
}
