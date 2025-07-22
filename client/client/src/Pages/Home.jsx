import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Components/Header.jsx';
import '../Pages/Home.css';
import FlightResult from '../Components/FlightResult';
import ToolTip from '../Components/TooTip.jsx';
import airplane from '../assets/airplane.png';
import { getTrackedFlights } from '../../api.js';
import ItineraryTooltip from '../Components/ItineraryTooltip.jsx';

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
            actual: '2025-06-30T06:13:00+00:00',
            actual_runway: '2025-06-30T06:13:00+00:00',
            airport: 'John F Kennedy International',
            delay: 13,
            estimated: '2025-06-30T06:00:00+00:00',
            estimated_runway: '2025-06-30T06:13:00+00:00',
            gate: '1',
            iata: 'JFK',
            icao: 'KJFK',
            scheduled: '2025-06-30T06:00:00+00:00',
            terminal: '8',
            timezone: 'America/New_York'
        },
        flight: {
            number: '171', iata: 'AA171', icao: 'AAL171'
        },
        flight_date: '2025-06-30',
        flight_status: 'active'
    };


    const [setUser, isSetUser] = useState(null);
    const [searchType, setSearchType] = useState('flight');
    const [flightForm, setFlightForm] = useState({
        airlineName: '',
        date: '',
        origin: '',
        destination: '',
        flightNumber: '',
        liveSearch: false,
    });
    const [searchResults, setSearchResults] = useState([flight]);
    const [trackedFlights, setTrackedFlights] = useState([]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/profile`,
                    {withCredentials: true});
                isSetUser(response.data);
            }   catch {
                console.error('User not Authenticated');
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        const loadTrackedFlights = async () => {
            try {
                const response = await getTrackedFlights();
                setTrackedFlights(response.data);
            } catch (error) {
                console.error('failed to load tracked flights', error);
            }
        };
        loadTrackedFlights();
    }, []);

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        const formValue = type === 'checkbox' ? checked : value;

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
                alert('No flights found');
                setSearchResults([]);
            } else {
                setSearchResults(response.data);
            }


        }   catch (error) {
            console.error(error);
            alert('No flights found');
        }
    };
    const handleFlightOption = () => setSearchType('flight');
    const handleRouteOption = () => setSearchType('route');

    const resultsToDisplay = searchResults.length > 0 ? searchResults : [flight];

    const handleTrackFlight = async () => {
        const loadTrackedFlights = async () => {
            try {
                const response = await getTrackedFlights();
                setTrackedFlights(response.data);
            } catch (error) {
                console.error('failed to load tracked flights', error);
            }
        };
        loadTrackedFlights();
    };

    return (
        <>
            <Header />
            <div className='home-container'>
                <h2>Welcome {setUser?.username}</h2>
                <p>Connect with your loved ones as they travel.</p>
                <div className='itineary'>
                    <ItineraryTooltip />
                </div>
                <section className='track-search-bar'>
                    <div className='search-btns'>
                        <ToolTip text={'Search by flight number'}>
                            <button
                                className='flight-btn'
                                onClick={handleFlightOption}
                            >
                                By Flight Number
                            </button>
                        </ToolTip>

                        <ToolTip text='Lookup a flights between two Airports'>
                            <button
                                className='route-btn'
                                onClick={handleRouteOption}
                            >
                                By Route
                            </button>
                        </ToolTip>
                    </div>
                    <form className='search-type' onSubmit={handleSearch}>
                        {searchType === 'flight' ? (
                            <>
                                <input
                                type='text'
                                name='flightNumber'
                                placeholder='Flight Number'
                                value={flightForm.flightNumber}
                                onChange={handleChange}
                                required
                                />
                                <input
                                type='date'
                                name='date'
                                placeholder='Date'
                                value={flightForm.date}
                                onChange={handleChange}
                                required
                                />
                            </>
                        ) : (
                            <>
                               <input
                                type='text'
                                name='airlineName'
                                placeholder='Airline'
                                value={flightForm.airlineName}
                                onChange={handleChange}
                                />
                                <input
                                type='date'
                                name='date'
                                placeholder='Date'
                                value={flightForm.date}
                                onChange={handleChange}
                                className='flight-calendar'
                                required
                                />
                                <input
                                type='text'
                                name='origin'
                                placeholder='Origin'
                                value={flightForm.origin}
                                onChange={handleChange}
                                required
                                />
                                <input
                                type='text'
                                name='destination'
                                placeholder='Destination'
                                value={flightForm.destination}
                                onChange={handleChange}
                                required
                                />
                            </>
                            )
                        }
                        <label
                            className='live-search'>
                            <input
                            type='checkbox'
                            name='liveSearch'
                            checked={flightForm.liveSearch}
                            onChange={handleChange}
                            />
                            Live Flights Only
                        </label>
                        <button
                            type='submit'
                            className='track-btn'
                        >
                                Search
                        </button>
                    </form>
                </section>

                <section className='flight-box'>
                    {resultsToDisplay.map((f, idx) => {
                        // find the tracked–flight entry for this flight (if any)
                        const trackedEntry = trackedFlights.find(
                            (tf) => tf.flightNumber === f.flight.iata
                        );
                        const isTracked  = Boolean(trackedEntry);
                        const trackedId  = trackedEntry?.id;

                        return (
                            <FlightResult
                            key={idx}
                            flight={f}
                            isTracked={isTracked}
                            trackedId={trackedId}
                            onTrackChange={handleTrackFlight}
                            />
                        );
                    })}
                </section>

                <div className='airplane-section'>
                    <img
                        src={airplane}
                        alt='Seneo Airplane'
                        className='airplane'
                    />
                </div>
            </div>
        </>
    );
}
