import axios from "axios";


// registration
export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, formData);
        return {wasSuccessful: true, data: response.data};
    }   catch (error) {
        const message = error.response && error.response.data && 
        error.response.data.error ? error.response.data.error : "Registration failed";
        return {wasSuccessful: false, error: message};
    }
}

export const loginUser = async (formData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, 
            formData,
            {withCredentials: true}
        );

        return {wasSuccessful: true, data: response.data};
    }   catch (error) {
        const message = error.response && error.response.data && 
        error.response.data.error ? error.response.data.error : "Login failed";
        return {wasSuccessful: false, error: message};
    }
}