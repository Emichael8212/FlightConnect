import { useState } from 'react';
import './FlightResult.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faBookmark as faSave, faTrash as faRemove } from '@fortawesome/free-solid-svg-icons';
import { saveTrackedFlight, deleteTrackedFlight } from '../../api';

export default function FlightResult({flight, isTracked, onTrackChange, trackedId }) {
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (!isTracked) {
                await saveTrackedFlight({
                airline: flight.airline.name,
                flightNumber: flight.flight.iata,
                departure: flight.departure.iata,
                arrival: flight.arrival.iata,
                flightDate: flight.flight_date,
                });
            } else {
                await deleteTrackedFlight(trackedId);
            }
            onTrackChange();
        }   catch (error) {
            alert('Error updating track status');
        }   finally {
            setSaving(false);
        }
    };

    return (
        <div className='result-container'>
            <button onClick={handleSave} className='save-track' disabled={saving}>
                <FontAwesomeIcon icon={isTracked ? faRemove : faSave} />
            </button>
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
                    <span className='flight-arrow'> <FontAwesomeIcon icon={faPlane} className='plane' /> </span>
                    <span>{flight.arrival.iata}</span>
                </div>
                <div className='flight-status'>
                    {flight.flight_status} On Time
                </div>
            </div>

            <div className='holder'>
                <div className='result-body'>
                    <div className='departure-section'>
                        <div className='departure-title'>
                            Departure
                        </div>
                        <div className='departure-airport'>{flight.departure.airport}</div>
                        <table className='departure-table'>
                            <tbody>
                                <tr>
                                    <th>Scheduled</th>
                                    <td>{flight.departure.scheduled}</td>
                                </tr>
                                <tr>
                                    <th>Estimated</th>
                                    <td>
                                        {flight.departure.estimated}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Actual</th>
                                    <td>
                                        {flight.departure.actual}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Runway</th>
                                    <td>
                                        {flight.departure.runway}
                                    </td>
                                </tr>
                            </tbody>
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
