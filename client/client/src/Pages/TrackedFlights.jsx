import { useState, useEffect } from "react";
import { getTrackedFlights, deleteTrackedFlight } from "../../api";
import "./TrackedFlights.css";
import Header from "../Components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

async function getAirlineLogo(airlineName, apiKey) {
  const apiUrl = `https://api.api-ninjas.com/v1/airlines?name=${encodeURIComponent(airlineName)}`;
  try {
    const res = await fetch(apiUrl, {
      headers: { "X-Api-Key": apiKey },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    // Match Python: check if the returned airline name contains the query
    for (const airline of data) {
      if (airline.name.toLowerCase().includes(airlineName.toLowerCase())) {
        return airline.logo_url || null;
      }
    }
    return null;
  } catch (err) {
    console.error("Error fetching airline logo for", airlineName, err);
    return null;
  }
}

export default function TrackedFlights() {
  const [trackedFlights, setTrackedFlights] = useState([]);
  const [airlineLogos, setAirlineLogos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const apiKey = import.meta.env.VITE_API_NINJAS_KEY;

  const loadFlights = async () => {
    setIsLoading(true);
    try {
      const response = await getTrackedFlights();
      setTrackedFlights(response.data);
    } catch {
      setErrorMessage("Failed to load tracked flights");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!apiKey) {
      console.warn("No API‑Ninjas key found; logos will not load");
    }
    loadFlights();
  }, [apiKey]);

  //
  useEffect(() => {
    if (!trackedFlights.length || !apiKey) return;

    (async () => {
      const uniqueAirlines = [...new Set(trackedFlights.map((f) => f.airline))];
      const newLogos = { ...airlineLogos };

      for (const name of uniqueAirlines) {
        if (!newLogos[name]) {
          newLogos[name] =
            (await getAirlineLogo(name, apiKey)) || "/placeholder-logo.png";
        }
      }

      setAirlineLogos(newLogos);
    })();
  }, [trackedFlights, apiKey]);

  const handleUnsaveFlight = async (flightId) => {
    try {
      await deleteTrackedFlight(flightId);
      toast.success("Flight removed from saved flights");
      loadFlights();
    } catch {
      toast.error("Failed to remove flight");
    }
  };

  if (isLoading) {
    return (
      <div className="tracked-layout">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your saved flights...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="tracked-layout">
        <Header />
        <div className="error-container">
          <div className="error-message">{errorMessage}</div>
        </div>
      </div>
    );
  }

  if (!trackedFlights.length) {
    return (
      <div className="tracked-layout">
        <Header />
        <div className="tracked-flights-empty">
          <h3>No Saved Flights</h3>
          <p>
            You haven't saved any flights yet. When you find a flight you like,
            save it to track it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tracked-layout">
      <Header />
      <h2 className="tracked-flights-header">Your Saved Tracks</h2>
      <div className="tracked-flights">
        {trackedFlights.map((flight) => (
          <div key={flight.id} className="flight-card">
            <div className="flight-card-header">
              {airlineLogos[flight.airline] && (
                <img
                  className="flight-card-logo"
                  src={airlineLogos[flight.airline]}
                  alt={`${flight.airline} logo`}
                />
              )}
              <h3 className="flight-card-airline">{flight.airline}</h3>
            </div>

            <div className="flight-card-body">
              <div className="flight-route">
                <span className="flight-route-airport">{flight.departure}</span>
                <span className="flight-route-separator">
                  <FontAwesomeIcon icon={faPlane} />
                </span>
                <span className="flight-route-airport">{flight.arrival}</span>
              </div>

              <div className="flight-details">
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Flight Number:</span>
                  <span className="flight-detail-value">
                    {flight.flightNumber}
                  </span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Date:</span>
                  <span className="flight-detail-value">
                    {new Date(flight.flightDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flight-card-footer">
              <span className="saved-date">
                Saved {new Date(flight.trackedAt).toLocaleDateString()}
              </span>
              <button
                className="unsave-button"
                onClick={() => handleUnsaveFlight(flight.id)}
              >
                <FontAwesomeIcon icon={faTrash} /> Unsave
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
