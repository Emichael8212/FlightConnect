import { useState } from "react"
import { registerUser } from "../../api";
import "./Register.css"


export default function Register() {
    
    const {setFormData, isSetFormData} = useState(
        {
            username: "",
            password: "",
            confirmPassword: "",
            email: ""
        },
    );

    const [registerMessage, setRegisterMessage] = useState("");

    const handleChange = (event) => {
        const {name, value} = event.target;
        isSetFormData(prev => ({...prev, [name]: value}));
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await registerUser(setFormData)
            setRegisterMessage(res.data.registerMessage);
        }   catch (error) {
            setRegisterMessage(res.error);
        }
    };

    return (
        <section>
            <form className="register-form" onSubmit={handleRegisterSubmit}>
                <label htmlFor="first-name" >Username:</label>
                <input id="first-name" type="text" name="first-name" 
                    value={setFormData.username} placeholder="Messi" onChange={handleChange}
                    required/>
                <br />

                <label htmlFor="password">Password:</label>
                <input id="password" type="password" value={setFormData.password} 
                    name="password" onChange={handleChange}
                    required/>
                <br />

                <label htmlFor="confirmPassword">Comfirm Password:</label>
                <input id="confirmPassword" type="password" value={setFormData.confirmPassword}
                    name="confirmPassword" onChange={handleChange}
                    required/>
                <br />

                <label htmlFor="email">Email:</label>
                <input id="email" type="text" name="email" value={setFormData.email} 
                    placeholder="immanuel@meta.com" onChange={handleChange}
                    required/>
                <br />

                <button type="submit">Register</button>

                {registerMessage && <p>{registerMessage}</p>}

            </form>
        </section>
    )
}