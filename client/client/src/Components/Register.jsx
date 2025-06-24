import "./Register.css"

export default function Register() {
    return (
        <section>
            <form className="register-form">
                <label htmlFor="first-name" >First Name:</label>
                <input id="first-name" type="text" name="first-name" placeholder="Messi"/>
                <br />

                <label htmlFor="last-name" >Lastt Name:</label>
                <input id="last-name" type="text" name="last-name" placeholder="Messi"/>
                <br />

                <label htmlFor="email">Email:</label>
                <input id="email" type="text" name="email" placeholder="immanuel@meta.com" />
                <br />

                <label htmlFor="password">Password:</label>
                <input id="password" type="password" name="password"/>
                <br />

                <label htmlFor="comfirm-password">Comfirm Password:</label>
                <input id="comfirm-password" type="password" name="comfirm-password"/>
                <br />


                <button>Register</button>

            </form>
        </section>
    )
}