import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default BASE_URL
// registration
export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`,
            formData,
            {withCredentials: true}
        );
        return {wasSuccessful: true, data: response.data};
    }   catch (error) {
        const message = error.response && error.response.data &&
        error.response.data.error ? error.response.data.error : "Registration failed";
        return {wasSuccessful: false, error: message};
    }
};
