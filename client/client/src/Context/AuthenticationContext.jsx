import { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import BASE_URL from "../../api";

// first, I need to create a context for the authentication context
const AuthenticationContext = createContext();

// Intializing a function provider for the authentication context
export default function AuthenticationContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);  // to track the authentication status

    // function to handle authentication
    useEffect(() => {
        axios.get(`${BASE_URL}/auth/profile`, { withCredentials: true })
            .then(response => {
                // save the user data from my backend
                setUser(response.data);
            })
            .catch(error => {
                setUser(null); // if the cookie is not valid, or user is not logged in

            })
            .finally(() => {
                setIsAuthenticating(false); // set the authentication status to false
            });
    }, []);

    // after login form submit, I need to call this function to set the authentication status to true
    const login = async (loginFormData) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, loginFormData, { withCredentials: true });
            setUser({username: loginFormData.username});
            return response.data;
        } catch (error) {
            throw error;
        }
    };


    // after logout, I need to call this function to set the authentication status to false
    const logout = async () => {
        await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
        setUser(null);
    };

    // after register, I need to call this function to set the authentication status to true
    return (
        <AuthenticationContext.Provider
            value={{ user, isAuthenticated: !!user, isAuthenticating, login, logout }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
}

// I need to create a hook to use the authentication context
export function useAuthenticationContext() {
    return useContext(AuthenticationContext);
}
