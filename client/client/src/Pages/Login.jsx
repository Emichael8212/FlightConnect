import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthenticationContext } from "../Context/AuthenticationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock, faUser } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../Components/Spinner";

export default function Login() {
  const [setLoginData, isSetLoginData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuthenticationContext();
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    isSetLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoginMessage("");
    try {
      await login(setLoginData);
      navigate("/");
    } catch (error) {
      setLoginMessage(error.response.data.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLoginSubmit}>
        {loading && <Spinner size={80} overlay={true} />}
        <h2>Login</h2>
        <div className="login-input">
          <input
            id="username"
            type="text"
            name="username"
            value={setLoginData.username}
            placeholder="Username"
            onChange={handleLoginChange}
          />
          <FontAwesomeIcon icon={faUser} className="input-icon" />
        </div>
        <div className="login-input">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={setLoginData.password}
            placeholder="Password"
            onChange={handleLoginChange}
          />
          <FontAwesomeIcon
            icon={showPassword ? faUnlock : faLock}
            onClick={handleShowPassword}
            className="input-icon password-icon"
          />
        </div>
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {loginMessage && <p className="login-error">{loginMessage}</p>}
        <Link to="/auth/register">
          <p>Register Here</p>
        </Link>
      </form>
    </div>
  );
}
