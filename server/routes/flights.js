import express from 'express';
import axios from 'axios';


const router = express.Router();

// acess flights from search
router.post('/search', async (req, res) => {
    const { origin, destination, date, airlineName, flightNumber, searchType, liveSearch } = req.body;
    // get api key from env
    const aviationKey = process.env.AVIATION_STACK_KEY;
    // obtain the base url for flight search
    let flightBaseURL = `http://api.aviationstack.com/v1/flights?access_key=${aviationKey}`;

    // check if user wants active flights or all flights
    if (liveSearch) {
        flightBaseURL += '&flight_status=active';
    }

    // check if user wants to search by flight number or route
    if (searchType === 'flight') {
        flightBaseURL += `&flight_iata=${flightNumber}`;
    } else if (searchType === 'route') {
        flightBaseURL += `&dep_iata=${origin}&arr_iata=${destination}`; }


    try {
        const apiResponse = await axios.get(flightBaseURL);
        let data = Array.isArray(apiResponse.data.data) ? apiResponse.data.data : [];

        // filter by airline name and user flight number
        if (searchType === 'route') {
            data = data.filter(flight => flight?.departure?.iata?.toUpperCase() === origin.toUpperCase() &&
            flight?.arrival?.iata?.toUpperCase() === destination.toUpperCase());
        }   else if (searchType === 'flight') {
            data = data.filter(flight => flight?.flight?.iata?.toUpperCase() === flightNumber.toUpperCase())
        }
        // filter by date
        if (date) {
            data = data.filter(flight => flight.flight_date === date)}

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No flights found' });
        }

        return res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

});


export default router;
