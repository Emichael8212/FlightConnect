import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faRightFromBracket, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import { useAuthenticationContext } from "../Context/AuthenticationContext";
import "./Profile.css";


export default function Profile() {

    // get user info from context
    const { user, logout } = useAuthenticationContext();
    const [showProfile, setShowProfile] = useState(false); // initate a state to control my profile modal
    const navigate = useNavigate(); // use navigate to redirect user to different pages

    // handle profile click event
    const handleProfileClick = (event) => {
        // prevent the default behavior of the button
        event.stopPropagation();
        // toggle the state of showProfile
        setShowProfile((prevShowProfile) => !prevShowProfile);
    };

    const closeModal = () => {
        setShowProfile(false);
    };
    // handle outside click event to close the modal
    const handleOutsideClick = (event) => {
        if (event.target.className === "profile-modal-overlay") {
            closeModal();
        };
    };
    // initiate a function to clear the user info and redirect user to login page
    const handleProfileLogout = async() => {
        await logout();
        navigate("/login", { replace: true });
    };

    const handleConnectClick = () => {
        closeModal();
        navigate("/connect");
    };

    const handleTrackedFlightsClick = () => {
        closeModal();
        navigate("/tracked-flights");
    };


    return (
        <div className="profile-container">
            <button onClick={handleProfileClick} className="profile-icon">
                <FontAwesomeIcon icon={faCircleUser} />
            </button>

            {showProfile && (
                <div className="profile-modal-overlay" onClick={handleOutsideClick}>
                    <div className="profile-modal">
                        <div className="user-info">
                            <p><strong className="user-name">{user.username}</strong></p>
                            <p><strong className="user-email">{user.email}</strong></p>
                        </div>

                        <div className="tracked-flight">
                            <button onClick={handleTrackedFlightsClick}>Tracked Flights</button>
                        </div>

                        <div className="connect">
                            <button onClick={handleConnectClick}>
                                <FontAwesomeIcon icon={faEnvelope} /> Send Message
                            </button>
                        </div>

                        <div className="logout">
                            <button onClick={handleProfileLogout}>
                                <FontAwesomeIcon icon={faRightFromBracket} />Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
