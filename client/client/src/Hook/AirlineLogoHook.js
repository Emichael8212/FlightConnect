import { useState, useEffect } from 'react';
export function useAirlineLogos(flights, apiKey) {
  const [fetchedAirlineLogos, setFetchedAirlineLogos] = useState({});

  useEffect(() => {
    if (!flights.length || !apiKey) return;

    // Get unique airlines that we don't already have logos for
    const uniqueAirlinesWithoutLogos = [...new Set(flights.map((flightDetails) => flightDetails.airline))].filter(
      (airlineName) => !fetchedAirlineLogos[airlineName]
    );

    if (uniqueAirlinesWithoutLogos.length === 0) return;

    // Fetch logos for airlines we don't have yet
    (async () => {
      const updatedAirlineLogos = { ...fetchedAirlineLogos };

      for (const airlineName of uniqueAirlinesWithoutLogos) {
        const fetchedLogoUrl = await getAirlineLogo(airlineName, apiKey);
        updatedAirlineLogos[airlineName] = fetchedLogoUrl || '/placeholder-logo.png';
      }

      setFetchedAirlineLogos(updatedAirlineLogos);
    })();
  }, [flights, apiKey]);

  return fetchedAirlineLogos;
}

async function getAirlineLogo(airlineName, apiKey) {
  const apiUrl = `https://api.api-ninjas.com/v1/airlines?name=${encodeURIComponent(
    airlineName
  )}`;
  try {
    const apiResponse = await fetch(apiUrl, {
      headers: { 'X-Api-Key': apiKey },
    });
    if (!apiResponse.ok) throw new Error(`HTTP ${apiResponse.status}`);
    const responseData = await apiResponse.json();
    if (!Array.isArray(responseData) || responseData.length === 0) return null;

    // Match Python: check if the returned airline name contains the query
    for (const airlineDetails of responseData) {
      if (airlineDetails.name.toLowerCase().includes(airlineName.toLowerCase())) {
        return airlineDetails.logo_url || null;
      }
    }
    return null;
  } catch (fetchError) {
    console.error('Error fetching airline logo for', airlineName, fetchError);
    return null;
  }
}
