import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '/api.js';
import axios from 'axios';
import './ItineraryTooltip.css';

export default function ItineraryTooltip() {
  const navigate = useNavigate();
  const [hasPreferences, setHasPreferences] = useState(false);

  // Check if user has preferences
  useEffect(() => {
    const checkPreferences = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/preference`, {
          withCredentials: true,
        });
        // If user has preferences, I set hasPreferences to true
        setHasPreferences(
          data &&
            data.defaultCity &&
            data.cuisine &&
            data.budgetTier &&
            data.activityCategory
        );
      } catch (err) {
        console.error('Error checking preferences:', err);
        setHasPreferences(false);
      }
    };

    checkPreferences();
  }, []);

  const handleNavigation = (destination) => {
    // If user doesn't have preferences, redirect to preferences page first
    if (!hasPreferences) {
      // Store the  destination to redirect after preferences are set
      sessionStorage.setItem('redirectAfterPreferences', destination);
      navigate('/preference');
    } else {
      // User has preferences, navigate to the destination
      navigate(destination);
    }
  };

  return (
    <div className='itinerary-tooltip-container'>
      <span className='itinerary-text'>Itinerary</span>
      <div className='itinerary-tooltip-content'>
        <h3>Enjoy Your Trip</h3>
        <div className='itinerary-buttons'>
          <button
            onClick={() => handleNavigation('/hotels')}
            className='itinerary-button hotel-button'
          >
            Hotels
          </button>
          <button
            onClick={() => handleNavigation('/restaurants')}
            className='itinerary-button restaurant-button'
          >
            Restaurants
          </button>
          <button
            onClick={() => handleNavigation('/things-to-do')}
            className='itinerary-button things-button'
          >
            Things to Do
          </button>
        </div>
      </div>
    </div>
  );
}
