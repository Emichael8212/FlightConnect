import { useState, useEffect, useRef } from "react";
import axios from "axios";
import BASE_URL from "/api";

// Configurations for each recommendation category
const RECOMMENDATION_CATEGORY_CONFIGURATIONS = {
  hotels: { endpoint: "hotels", responseKey: "hotels" },
  restaurants: { endpoint: "restaurants", responseKey: "restaurants" },
  thingsToDo: { endpoint: "things-to-do", responseKey: "thingsToDo" },
};


export default function useListPage(endpoint, weights, cityForRecommendation) {
  const [recommendationItems, setRecommendationItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchItems, 500);
    return () => clearTimeout(debounceRef.current);
  }, [weights, cityForRecommendation]);

  async function fetchItems() {
    setLoading(true);
    try {
      // Create the request payload with weights directly at the top level
      const payload = { weights };

      // Add cityForRecommendation if it exists
      if (cityForRecommendation) {
        payload.cityForRecommendation = cityForRecommendation;
      }

      const { data } = await axios.post(
        `${BASE_URL}/${endpoint}`,
        payload,
        { withCredentials: true }
      );

      // Get the response key based on the endpoint
      let responseKey;
      switch (endpoint) {
        case "hotels":
          responseKey = "hotels";
          break;
        case "restaurants":
          responseKey = "restaurants";
          break;
        case "things-to-do":
          responseKey = "thingsToDo";
          break;
        default:
            responseKey = toCamel(endpoint);
      }

      const list = data[responseKey] || [];

      setRecommendationItems(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setRecommendationItems([]);
    } finally {
      setLoading(false);
    }
  }
  return { recommendationItems, loading };
}


export function useItineraryRecommendations({
  categories = ["hotels", "restaurants", "thingsToDo"],
  userPreferenceWeights,
  overrideCityForRecommendations,
  debounceDelayInMilliseconds = 500,
}) {
  // State: recommendations as { hotels: [], restaurants: [], thingsToDo: [] }
  const [categoryRecommendations, setCategoryRecommendations] = useState(
    categories.reduce((accumulator, currentCategory) => ({ ...accumulator, [currentCategory]: [] }), {})
  );
  const [isLoadingByCategory, setIsLoadingByCategory] = useState(
    categories.reduce((accumulator, currentCategory) => ({ ...accumulator, [currentCategory]: false }), {})
  );
  const [errorByCategory, setErrorByCategory] = useState(
    categories.reduce((accumulator, currentCategory) => ({ ...accumulator, [currentCategory]: null }), {})
  );
  const debounceTimersRef = useRef({});

  useEffect(() => {
    // Clear existing timeouts
    Object.values(debounceTimersRef.current).forEach(clearTimeout);

    // Fetch for each category
    categories.forEach((currentCategory) => {
      debounceTimersRef.current[currentCategory] = setTimeout(() => fetchRecommendationsForCategory(currentCategory), debounceDelayInMilliseconds);
    });

    // Cleanup on unmount or dependency change
    return () => {
      Object.values(debounceTimersRef.current).forEach(clearTimeout);
    };
  }, [userPreferenceWeights, overrideCityForRecommendations, categories, debounceDelayInMilliseconds]);

  async function fetchRecommendationsForCategory(recommendationCategory) {
    if (!RECOMMENDATION_CATEGORY_CONFIGURATIONS[recommendationCategory]) {
      console.error(`Invalid category: ${recommendationCategory}`);
      setErrorByCategory((previousErrors) => ({ ...previousErrors, [recommendationCategory]: "Invalid category" }));
      return;
    }

    const { endpoint, responseKey } = RECOMMENDATION_CATEGORY_CONFIGURATIONS[recommendationCategory];
    setIsLoadingByCategory((previousLoadingStates) => ({ ...previousLoadingStates, [recommendationCategory]: true }));
    setErrorByCategory((previousErrors) => ({ ...previousErrors, [recommendationCategory]: null }));

    try {
      const requestPayload = { weights: userPreferenceWeights };
      // Only include city if truthy
      if (overrideCityForRecommendations) {
        requestPayload.cityForRecommendation = overrideCityForRecommendations;
      }

      const { data: responseData } = await axios.post(`${BASE_URL}/${endpoint}`, requestPayload, {
        withCredentials: true,
      });

      const categoryItems = Array.isArray(responseData[responseKey]) ? responseData[responseKey] : [];
      setCategoryRecommendations((previousRecommendations) => ({ ...previousRecommendations, [recommendationCategory]: categoryItems }));
    } catch (fetchError) {
      console.error(`Error fetching ${recommendationCategory}:`, fetchError);
      setErrorByCategory((previousErrors) => ({
        ...previousErrors,
        [recommendationCategory]: fetchError.response?.data?.message || "Failed to fetch recommendations",
      }));
      setCategoryRecommendations((previousRecommendations) => ({ ...previousRecommendations, [recommendationCategory]: [] }));
    } finally {
      setIsLoadingByCategory((previousLoadingStates) => ({ ...previousLoadingStates, [recommendationCategory]: false }));
    }
  }

  return { categoryRecommendations, isLoadingByCategory, errorByCategory };

}

function toCamel(str) {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}
