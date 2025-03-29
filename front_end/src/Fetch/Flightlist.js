import React from 'react';
import { useNavigate } from 'react-router-dom';

const FlightList = ({ flights }) => {
  const navigate = useNavigate();

  if (flights.length === 0) {
    return (
      <div className="teade">
        <div className="teade-icon">✈️</div>
        <p>Valitud filtritele vastavaid lende ei leitud.</p>
      </div>
    );
  }

  const handleSelectFlight = (flightId) => {
    navigate(`/seats/${flightId}`);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('et-EE', options);
  };

  return (
    <div className="lennukaardid">
      {flights.map((flight) => {
        const departureTime = new Date(flight.lahkumisaeg).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const arrivalTime = new Date(flight.saabumisaeg).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const departureDate = formatDate(flight.lahkumisaeg);

        const departureDateTime = new Date(flight.lahkumisaeg);
        const arrivalDateTime = new Date(flight.saabumisaeg);
        const durationMs = arrivalDateTime - departureDateTime;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const durationText = `${durationHours}h ${durationMinutes}min`;

        return (
          <div
            key={flight.id}
            className="lennukaart"
            onClick={() => handleSelectFlight(flight.id)}
          >
            <div className="flight-header">
              <span className="airline-name">{flight.lennukompanii}</span>
              <span className="flight-number">{flight.lennuNumber}</span>
            </div>

            <div className="flight-times">
              <div className="departure">
                <div className="time">{departureTime}</div>
                <div className="location">{flight.lahkumiskoht}</div>
                <div className="date">{departureDate}</div>
              </div>

              <div className="flight-duration">
                <div className="duration-text">Direct • {durationText}</div>
                <div className="duration-line"></div>
              </div>

              <div className="arrival">
                <div className="time">{arrivalTime}</div>
                <div className="location">{flight.sihtkoht}</div>
              </div>
            </div>

            <div className="flight-details">
              <div className="flight-info">
                <div className="select-label">Details and upgrades</div>
              </div>
              <div className="price-tag">
                <div className="price-label">Price per person</div>
                <div className="price-amount">€{flight.hind}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightList;
