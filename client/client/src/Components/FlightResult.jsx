import "./FlightResult.css";


export default function FlightResult({flight }) {

    return (
        <div className='result-container'>
            <div className='result-header'>
                <div>
                    <div className='flight-number'>
                        {flight.flight.iata}
                    </div>
                    <div className='flight-name'>
                        {flight.airline.name} ({flight.airline.iata})
                    </div>
                </div>
                <div className='flight-route'>
                    <span>{flight.departure.iata}</span>
                    <span className='flight-arrow'> 🛫 </span>
                    <span>{flight.arrival.iata}</span>
                </div>
                <div className='flight-status'>
                    {flight.flight_status} On Time
                </div>
            </div>

            <div className="holder">
                <div className='result-body'>
                    <div className='departure-section'>
                        <div className='departure-title'>
                            Departure
                        </div>
                        <div className='departure-airport'>{flight.departure.airport}</div>
                        <table className="departure-table">
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr>
                                <td>
                                    Scheduled
                                    <br />
                                    {flight.departure.scheduled}
                                </td>
                                <td>
                                    Estimated
                                    <br />
                                    {flight.departure.estimated}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Actual
                                    <br />
                                    {flight.departure.actual}
                                </td>
                                <td>
                                    Runway
                                    <br />
                                    {flight.departure.runway}
                                </td>
                            </tr>

                        </table>
                        <div className='terminal'>
                            <label>Terminal</label>
                            <span>{flight.departure.terminal}</span>
                        </div>
                        <div className='gate'>
                            <label>Gate</label>
                            <span>{flight.departure.gate}</span>
                        </div>
                    </div>

                    <div className='arrival-section'>
                        <div className='arrival-title'>
                            Arrival
                        </div>
                        <div className='arrival-airport'>{flight.arrival.airport}</div>
                        <table className='arrival-table'>
                            <tbody>
                                <tr>
                                    <th>Scheduled</th>
                                    <td>{flight.arrival.scheduled}</td>
                                </tr>
                                <tr>
                                    <th>Estimated</th>
                                    <td>{flight.arrival.estimated}</td>
                                </tr>
                                <tr>
                                    <th>Actual</th>
                                    <td>{flight.arrival.actual}</td>
                                </tr>
                                <tr>
                                    <th>Runway</th>
                                    <td>{flight.arrival.runway}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='terminal'>
                            <label>Terminal</label>
                            <span>{flight.arrival.terminal}</span>
                        </div>
                        <div className='gate'>
                            <label>Gate</label>
                            <span>{flight.arrival.gate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
