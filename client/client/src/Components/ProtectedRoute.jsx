import { useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";
import { useAuthenticationContext } from "../Context/AuthenticationContext";

export default function ProtectedRoute({ children }) {
    // first I access the login status from the context
    const { isAuthenticated, isAuthenticating } = useAuthenticationContext();
    // initialize the hook to navigate
    const navigate = useNavigate();
    // check authentication status
    useEffect(() => {
        // if not authenticated and not authenticating, redirect to login page
        if (!isAuthenticating && !isAuthenticated) {
            navigate("/auth/login", { replace: true });
        }
    }, [isAuthenticated, isAuthenticating, navigate])
    // return the children if authenticated
    if (isAuthenticating) {
        return null;
    }

    if (!isAuthenticated) {
        return null;
    }
    return children;
}
