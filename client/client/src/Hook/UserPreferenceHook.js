import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useWeightsHook from './WeightsHook.js';
import { sumsToOne } from '../utils/utils.js';
import BASE_URL from '../../api';
import {
  DEFAULT_MAIN_WEIGHTS,
  DEFAULT_HOTEL_WEIGHTS,
  DEFAULT_RESTAURANT_WEIGHTS,
  DEFAULT_THINGS_TO_DO_WEIGHTS,
} from '@shared/WeightsConstants';

function mergeWeights(defaults, source) {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, def]) => [
      key,
      source[key] != null ? source[key] : def
    ])
  );
}

export default function usePreferences(navigate) {
  const [basicPreferences, setBasicPreferences] = useState({
    defaultCity: '',
    cuisine: '',
    budgetTier: '',
    activityCategory: '',
  });

  const [mainWeights, handleMainWeightsChange, setMainWeights] = useWeightsHook(DEFAULT_MAIN_WEIGHTS);
  const [hotelWeights, handleHotelWeightsChange, setHotelWeights] = useWeightsHook(DEFAULT_HOTEL_WEIGHTS);
  const [restaurantWeights, handleRestaurantWeightsChange, setRestaurantWeights] = useWeightsHook(DEFAULT_RESTAURANT_WEIGHTS);
  const [thingsToDoWeights, handleThingsToDoWeightsChange, setThingsToDoWeights] = useWeightsHook(DEFAULT_THINGS_TO_DO_WEIGHTS);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingCity, setIsCheckingCity] = useState(false);
  const [cityValidationError, setCityValidationError] = useState('');
  const [isCityValid, setIsCityValid] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const hasLoadedPreferences = useRef(false);

  const handleBasicFieldChange = (e) => {
    const { name, value } = e.target;
    setBasicPreferences((prev) => ({ ...prev, [name]: value }));

    if (name === 'defaultCity') {
      setCityValidationError('');
      setIsCityValid(false);
    }
  };

  const validateCityInput = async () => {
    const city = basicPreferences.defaultCity.trim();
    if (!city) {
      setCityValidationError('Please enter a city.');
      setIsCityValid(false);
      return false;
    }
    setIsCheckingCity(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/preference/exists`, {
        params: { defaultCity: city },
        withCredentials: true
      });
      if (!data.exists) {
        setCityValidationError(`We don’t have data for “${city}.”`);
        setIsCityValid(false);
        return false;
      }
      setCityValidationError('');
      setIsCityValid(true);
      return true;
    } catch (err) {
      setCityValidationError('Could not verify city. Try again.');
      setIsCityValid(false);
      return false;
    } finally {
      setIsCheckingCity(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/preference`, {
          withCredentials: true,
        });
        if (data) {
            setBasicPreferences({
                defaultCity: data.defaultCity || '',
                cuisine: data.cuisine || '',
                budgetTier: data.budgetTier?.toString() || '',
                activityCategory: data.activityCategory || '',
            });
            [
                { setter: setMainWeights,      defaults: DEFAULT_MAIN_WEIGHTS      },
                { setter: setHotelWeights,     defaults: DEFAULT_HOTEL_WEIGHTS     },
                { setter: setRestaurantWeights,defaults: DEFAULT_RESTAURANT_WEIGHTS},
                { setter: setThingsToDoWeights,defaults: DEFAULT_THINGS_TO_DO_WEIGHTS},
            ].forEach(({ setter, defaults }) => {setter(mergeWeights(defaults, data));});
        }
      } catch (err) {
        console.error('Preference Load Error:', err);
      } finally {
        hasLoadedPreferences.current = true;
        setPreferencesLoaded(true);
      }
    })();
  }, []);

  const handlePreferenceFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!(await validateCityInput())) {
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/preference`,
        {
          ...basicPreferences,
          ...mainWeights,
          ...hotelWeights,
          ...restaurantWeights,
          ...thingsToDoWeights,
          budgetTier: Number(basicPreferences.budgetTier),
        },
        { withCredentials: true }
      );
      setIsSubmitting(false);

      const redirectPath = sessionStorage.getItem('redirectAfterPreferences');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterPreferences');
        navigate(redirectPath);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Preference Submit Error:', err);
      setIsSubmitting(false);
    }
  };

    const hasAllRequiredBasicFields =
        basicPreferences.defaultCity.trim() &&
        basicPreferences.cuisine &&
        basicPreferences.budgetTier &&
        basicPreferences.activityCategory;

    // Define an array of all weight groups for validation
    const allWeightGroups = [mainWeights, hotelWeights, restaurantWeights, thingsToDoWeights];
    // Helper to check if all groups are valid (sums to ~1)
    const areAllWeightsValid = allWeightGroups.every(groupWeights => sumsToOne(Object.values(groupWeights)));

    const isFormValid =
        hasAllRequiredBasicFields &&
        isCityValid &&
        areAllWeightsValid;

    const weightGroupsMapping = {
        'Main Weights': { weights: mainWeights, changeHandler: handleMainWeightsChange },
        'Hotel Weights': { weights: hotelWeights, changeHandler: handleHotelWeightsChange },
        'Restaurant Weights': { weights: restaurantWeights, changeHandler: handleRestaurantWeightsChange },
        'Things To Do Weights': { weights: thingsToDoWeights, changeHandler: handleThingsToDoWeightsChange },
    };

  return {
    basicPreferences,
    handleBasicFieldChange,
    isSubmitting,
    isCheckingCity,
    cityValidationError,
    isFormValid,
    handlePreferenceFormSubmit,
    validateCityInput,
    weightGroupsMapping,
  };
}
