import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Components/Header.jsx";
import FlightResult from "../Components/FlightResult";


export default function Home() {

    const flight = {
        airline: {name: 'American Airlines', iata: 'AA'},
        arrival: {
            actual: null,
            actual_runway: null,
            airport: 'Los Angeles International',
            bagage: 'T5C5',
            delay: null,
            estimated: '2025-06-30T08:31:00+00:00',
            gate: '50',
            iata: 'LAX',
            icao: 'KLAX',
            scheduled: '2025-06-30T08:31:00+00:00',
            terminal: '5',
            timezone: 'America/Los_Angeles'
        },
        departure: {
            actual: "2025-06-30T06:13:00+00:00",
            actual_runway: "2025-06-30T06:13:00+00:00",
            airport: "John F Kennedy International",
            delay: 13,
            estimated: "2025-06-30T06:00:00+00:00",
            estimated_runway: "2025-06-30T06:13:00+00:00",
            gate: "1",
            iata: "JFK",
            icao: "KJFK",
            scheduled: "2025-06-30T06:00:00+00:00",
            terminal: "8",
            timezone: "America/New_York"
        },
        flight: {
            number: '171', iata: 'AA171', icao: 'AAL171'
        },
        flight_date: "2025-06-30",
        flight_status: "active"
    }


    const [setUser, isSetUser] = useState(null);
    const [searchType, setSearchType] = useState("flight")
    const [flightForm, setFlightForm] = useState({
        airlineName: "",
        date: "",
        origin: "",
        destination: "",
        flightNumber: "",
        liveSearch: false,
    })
    const [searchResults, setSearchResults] = useState([flight]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/profile`,
                    {withCredentials: true});
                isSetUser(response.data)
            }   catch (error) {
                console.error("User not Authenticated")
            }
        };
        getUser();
    }, [])

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        const formValue = type === "checkbox" ? checked : value;

        // update the state variable for the input field
        setFlightForm(prev => ({...prev, [name]: formValue}));
    };

    // handle subnission
    const handleSearch = async (event) => {
        event.preventDefault();
        // fetch data
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/search`, {
                ...flightForm,
                searchType: searchType,
            }, {withCredentials: true});

            if (response.data.length === 0) {
                alert("No flights found");
                setSearchResults([]);
            } else {
                setSearchResults(response.data);
            }


        }   catch (error) {
            console.error(error);
            alert("No flights found")
        }
    }
    const handleFlightOption = () => setSearchType("flight");
    const handleRouteOption = () => setSearchType("route");

    const resultsToDisplay = searchResults.length > 0 ? searchResults : [flight]

    return (
        <main>
            <Header />
            <div className="flight-container">
                <h2>Welcome {setUser?.username}</h2>
                <p>Connect with your loved ones as they travel.</p>
                <section className="track-searchbar">
                    <div className="search-btns">
                        <button className="flight-btn" onClick={handleFlightOption}>By Flight Number</button>
                        <button className="route-btn" onClick={handleRouteOption}>By Route</button>
                    </div>
                    <form onSubmit={handleSearch}>
                        {searchType === "flight" ? (
                            <>
                                <input
                                type="text"
                                name="flightNumber"
                                placeholder="Flight Number"
                                value={flightForm.flightNumber}
                                onChange={handleChange}
                                required
                                />
                                <input
                                type="date"
                                name="date"
                                placeholder="Date"
                                value={flightForm.date}
                                onChange={handleChange}
                                required
                                />
                            </>
                        ) : (
                            <>
                               <input
                                type="text"
                                name="airlineName"
                                placeholder="Airline"
                                value={flightForm.airlineName}
                                onChange={handleChange}
                                />
                                <input
                                type="date"
                                name="date"
                                placeholder="Date"
                                value={flightForm.date}
                                onChange={handleChange}
                                required
                                />
                                <input
                                type="text"
                                name="origin"
                                placeholder="Origin"
                                value={flightForm.origin}
                                onChange={handleChange}
                                required
                                />
                                <input
                                type="text"
                                name="destination"
                                placeholder="Destination"
                                value={flightForm.destination}
                                onChange={handleChange}
                                required
                                />
                            </>
                            )
                        }
                        <label>
                            <input
                            type="checkbox"
                            name="liveSearch"
                            checked={flightForm.liveSearch}
                            onChange={handleChange}
                            />
                            Show Only Live Flights
                        </label>
                        <button type="submit">Search</button>
                    </form>

                    <section>
                        {resultsToDisplay.map((flight, index) => (
                            <FlightResult key={index} flight={flight} />
                        ))}
                    </section>

                </section>
            </div>
        </main>
    )
}
