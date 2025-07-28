import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default BASE_URL;
// registration
export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/register`,
            formData,
            {withCredentials: true}
        );
        return {wasSuccessful: true, data: response.data};
    }   catch (error) {
        const message = error.response && error.response.data &&
        error.response.data.error ? error.response.data.error : 'Registration failed';
        return {wasSuccessful: false, error: message};
    }
};
export const getTrackedFlights = () =>
  axios.get(`${BASE_URL}/tracked-flights`,
    { withCredentials: true }
);

export const saveTrackedFlight = data =>
  axios.post(`${BASE_URL}/tracked-flights`, {
    airline:     data.airline,
    flightNumber: data.flightNumber,
    departure:   data.departure,
    arrival:     data.arrival,
    flightDate:  data.flightDate,
  }, { withCredentials: true });


export const deleteTrackedFlight = (id) =>
  axios.delete(`${BASE_URL}/tracked-flights/${id}`,
    { withCredentials: true }
);
