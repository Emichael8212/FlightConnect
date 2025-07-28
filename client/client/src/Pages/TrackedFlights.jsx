import { useState, useEffect } from 'react';
import { getTrackedFlights, deleteTrackedFlight } from '../../api';
import './TrackedFlights.css';
import Header from '../Components/Header';
import { toast } from 'react-toastify';
import { useAirlineLogos } from '../Hook/AirlineLogoHook';
import Spinner from '../Components/Spinner';
import { FlightCard, EmptyState, ErrorState } from '../Components/TrackedFlightsComponents';

export default function TrackedFlights() {
  const [savedTrackedFlights, setSavedTrackedFlights] = useState([]);
  const [isLoadingTrackedFlights, setIsLoadingTrackedFlights] = useState(true);
  const [trackedFlightsErrorMessage, setTrackedFlightsErrorMessage] = useState('');

  const airlineLogoApiKey = import.meta.env.VITE_API_NINJAS_KEY;
  const fetchedAirlineLogos = useAirlineLogos(savedTrackedFlights, airlineLogoApiKey);

  const loadSavedTrackedFlights = async () => {
    setIsLoadingTrackedFlights(true);
    try {
      const apiResponse = await getTrackedFlights();
      toast.info('Loaded saved flights');
      setSavedTrackedFlights(apiResponse.data);
    } catch (fetchError) {
      console.error('Error loading tracked flights:', fetchError);
      setTrackedFlightsErrorMessage('Failed to load tracked flights');
    } finally {
      setIsLoadingTrackedFlights(false);
    }
  };

  useEffect(() => {
    if (!airlineLogoApiKey) {
      console.warn('No API‑Ninjas key found; logos will not load');
    }
    loadSavedTrackedFlights();
  }, [airlineLogoApiKey]);

  const handleUnsaveTrackedFlight = async (flightId) => {
    try {
      await deleteTrackedFlight(flightId);
      toast.success('Flight removed from saved flights');
      loadSavedTrackedFlights();
    } catch (deleteError) {
      console.error('Error removing flight:', deleteError);
      toast.error('Failed to remove flight');
    }
  };

  const renderTrackedFlightsContent = () => {
    if (isLoadingTrackedFlights) {
      return <Spinner overlay={true} text={'loading..'}/>;
    }

    if (trackedFlightsErrorMessage) {
      return <ErrorState message={trackedFlightsErrorMessage} />;
    }

    if (!savedTrackedFlights.length) {
      return <EmptyState />;
    }

    return (
      <>
        <h2 className='tracked-flights-header'>Your Saved Tracks</h2>
        <div className='tracked-flights'>
          {savedTrackedFlights.map((flightDetails) => (
            <FlightCard
              key={flightDetails.id}
              flightDetails={flightDetails}
              airlineLogoUrl={fetchedAirlineLogos[flightDetails.airline]}
              onUnsaveFlight={handleUnsaveTrackedFlight}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className='tracked-layout'>
      <Header />
      {renderTrackedFlightsContent()}
    </div>
  );
}
