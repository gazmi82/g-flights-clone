// src/components/FlightSearch/FlightSearch.tsx
import React, { useState } from "react";
import useAirports from "../../hooks/useAirports";
import useFlights, { SearchParams } from "../../hooks/useFlights";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FlightSearch.scss";
import { Airport } from "../../services/api";

const FlightSearch: React.FC = () => {
  const [originQuery, setOriginQuery] = useState<string>("");
  const [destinationQuery, setDestinationQuery] = useState<string>("");
  const [selectedOrigin, setSelectedOrigin] = useState<Airport | null>(null);
  const [selectedDestination, setSelectedDestination] =
    useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>(""); // optional

  // Get airport suggestions (debounced) for Origin and Destination
  const { airports: originOptions } = useAirports(originQuery);
  const { airports: destinationOptions } = useAirports(destinationQuery);

  // useFlights hook retrieves flights (and carriers if needed)
  const { flights, loading, searchFlights } = useFlights();

  // Handle the form submission to trigger flight search
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrigin || !selectedDestination || !departureDate) {
      return;
    }
    const params: SearchParams = {
      originSkyId: selectedOrigin.skyId,
      destinationSkyId: selectedDestination.skyId,
      originEntityId: selectedOrigin.entityId,
      destinationEntityId: selectedDestination.entityId,
      date: departureDate,
      returnDate, // optional
    };
    console.log("FlightSearch - Submitting with params:", params);
    searchFlights(params);
  };

  return (
    <div className="flight-search-container">
      <h1>Flight Search</h1>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flight-search-form">
        {/* Origin Input */}
        <div className="form-group">
          <label htmlFor="origin">Origin</label>
          <input
            type="text"
            id="origin"
            value={originQuery}
            onChange={(e) => {
              setOriginQuery(e.target.value);
              setSelectedOrigin(null);
            }}
            placeholder="Enter origin city or airport"
            required
          />
          {originOptions.length > 0 && !selectedOrigin && (
            <ul className="suggestions">
              {originOptions.map((airport) => (
                <li
                  key={airport.entityId}
                  onClick={() => {
                    setSelectedOrigin(airport);
                    setOriginQuery(airport.presentation.title);
                  }}
                >
                  {airport.presentation.title} ({airport.skyId}) -{" "}
                  {airport.presentation.subtitle}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination Input */}
        <div className="form-group">
          <label htmlFor="destination">Destination</label>
          <input
            type="text"
            id="destination"
            value={destinationQuery}
            onChange={(e) => {
              setDestinationQuery(e.target.value);
              setSelectedDestination(null);
            }}
            placeholder="Enter destination city or airport"
            required
          />
          {destinationOptions.length > 0 && !selectedDestination && (
            <ul className="suggestions">
              {destinationOptions.map((airport) => (
                <li
                  key={airport.entityId}
                  onClick={() => {
                    setSelectedDestination(airport);
                    setDestinationQuery(airport.presentation.title);
                  }}
                >
                  {airport.presentation.title} ({airport.skyId}) -{" "}
                  {airport.presentation.subtitle}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Departure Date Input */}
        <div className="form-group">
          <label htmlFor="departureDate">Departure Date</label>
          <input
            type="date"
            id="departureDate"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>

        {/* Return Date (Optional) */}
        <div className="form-group">
          <label htmlFor="returnDate">Return Date (Optional)</label>
          <input
            type="date"
            id="returnDate"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>

        <button type="submit" className="search-button">
          Search Flights
        </button>
      </form>

      {loading && <p className="info-text">Loading flights...</p>}

      {/* Display flights */}
      {flights.length > 0 && (
        <div className="flight-results">
          <h2>Available Flights</h2>
          <div className="flights-list">
            {flights.map((flight, flightIndex) => (
              <div className="flight-row" key={flightIndex}>
                {/* Loop over each leg and each segment */}
                {flight.legs?.map((leg, legIndex) => {
                  return leg.segments?.map((segment, segIndex) => {
                    // Format times to "7:10 AM" or "9:20 PM"
                    const depDate = new Date(segment.departure || "");
                    const arrDate = new Date(segment.arrival || "");
                    const departureTime = depDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                    const arrivalTime = arrDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });

                    // If you have an airline logo, else put the Airline name
                    const airlineName = segment.operatingCarrier?.name || "N/A";
                    const airlineLogoUrl =
                      segment.operatingCarrier?.logoUrl || "";
                    console.log(segment);

                    return (
                      <div className="flight-segment" key={segIndex}>
                        {/* Airline Logo */}
                        <div className="flight-logo">
                          {airlineLogoUrl ? (
                            <img
                              src={airlineLogoUrl}
                              alt={airlineName}
                              className="logo-img"
                            />
                          ) : (
                            <div className="logo-placeholder">
                              {airlineName}
                            </div>
                          )}
                        </div>

                        {/* Times and Airline Name */}
                        <div className="flight-info">
                          <div className="flight-time">
                            {departureTime} – {arrivalTime}
                          </div>
                          <div className="flight-airline">{airlineName}</div>
                        </div>

                        {/* Price - if you want to show at segment level or flight level */}
                        <div className="flight-price">
                          {flight.price?.formatted || "N/A"}
                          <span className="price-label"> round trip</span>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FlightSearch;
