import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faTrash } from '@fortawesome/free-solid-svg-icons';

// Flight Card Component
export const FlightCard = ({ flightDetails, airlineLogoUrl, onUnsaveFlight }) => {
  return (
    <div key={flightDetails.id} className='flight-card'>
      <div className='flight-card-header'>
        {airlineLogoUrl && (
          <img
            className='flight-card-logo'
            src={airlineLogoUrl}
            alt={`${flightDetails.airline} logo`}
          />
        )}
        <h3 className='flight-card-airline'>{flightDetails.airline}</h3>
      </div>

      <div className='flight-card-body'>
        <div className='flight-route'>
          <span className='flight-route-airport'>{flightDetails.departure}</span>
          <span className='flight-route-separator'>
            <FontAwesomeIcon icon={faPlane} />
          </span>
          <span className='flight-route-airport'>{flightDetails.arrival}</span>
        </div>

        <div className='flight-details'>
          <div className='flight-detail-item'>
            <span className='flight-detail-label'>Flight Number:</span>
            <span className='flight-detail-value'>{flightDetails.flightNumber}</span>
          </div>
          <div className='flight-detail-item'>
            <span className='flight-detail-label'>Date:</span>
            <span className='flight-detail-value'>
              {new Date(flightDetails.flightDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className='flight-card-footer'>
        <span className='saved-date'>
          Saved {new Date(flightDetails.trackedAt).toLocaleDateString()}
        </span>
        <button className='unsave-button' onClick={() => onUnsaveFlight(flightDetails.id)}>
          <FontAwesomeIcon icon={faTrash} /> Unsave
        </button>
      </div>
    </div>
  );
};

// Error State Component
export const ErrorState = ({ errorMessage }) => (
  <div className='error-container'>
    <div className='error-message'>{errorMessage}</div>
  </div>
);

// Empty State Component
export const EmptyState = () => (
  <div className='tracked-flights-empty'>
    <h3>No Saved Flights</h3>
    <p>
      You haven't saved any flights yet. When you find a flight you like, save
      it to track it here.
    </p>
  </div>
);
