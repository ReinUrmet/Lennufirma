import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import FlightList from '../../Fetch/Flightlist';
import './Flights.css';

function Flights() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const destinationParam = queryParams.get('destination');

  const [filters, setFilters] = useState({
    alguskoht: '',
    sihtkoht: destinationParam || '',
    kuupaev: '',
    hind: { min: '', max: '' },
  });

  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFlights();
  }, [filters]);

  const fetchFlights = async () => {
    setLoading(true);
    setFlights([]);

    const queryParams = new URLSearchParams();
    if (filters.alguskoht) queryParams.append('origin', filters.alguskoht);
    if (filters.sihtkoht) queryParams.append('destination', filters.sihtkoht);
    if (filters.kuupaev) queryParams.append('date', filters.kuupaev);
    if (filters.hind.min) queryParams.append('minPrice', filters.hind.min);
    if (filters.hind.max) queryParams.append('maxPrice', filters.hind.max);

    try {
      const response = await fetch(`/api/flights?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Error fetching flights');
      const data = await response.json();
      setFlights(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'hind_min' || name === 'hind_max') {
      setFilters((prev) => ({
        ...prev,
        hind: {
          ...prev.hind,
          [name === 'hind_min' ? 'min' : 'max']: value,
        },
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="flights-container">
      <header className="flights-header">
        <div className="logo">LennuPortaal</div>
        <nav>
          <ul>
            <li><Link to="/">Avaleht</Link></li>
            <li><Link to="/flights" className="active">Lennud</Link></li>
            <li><Link to="#">Istekohad</Link></li>
            <li><Link to="#">Kontakt</Link></li>
          </ul>
        </nav>
      </header>

      <section className="flights-title">
        <h1>Select your flight</h1>
        <p>Prices are for 1 adult per direction (EUR)</p>
      </section>

      <main className="flights-main">
        <section className="otsingusektsioon">
          <div className="filters-panel">
            <h2>Lennu filtrid</h2>
            <div className="filtrid">
              <div className="filtriRuhm">
                <label htmlFor="alguskoht">Alguskoht:</label>
                <input type="text" id="alguskoht" name="alguskoht" value={filters.alguskoht} onChange={handleFilterChange} placeholder="Sisesta alguskoht" />
              </div>
              <div className="filtriRuhm">
                <label htmlFor="sihtkoht">Sihtkoht:</label>
                <input type="text" id="sihtkoht" name="sihtkoht" value={filters.sihtkoht} onChange={handleFilterChange} placeholder="Sisesta sihtkoht" />
              </div>
              <div className="filtriRuhm">
                <label htmlFor="kuupaev">Kuupäev:</label>
                <input type="date" id="kuupaev" name="kuupaev" value={filters.kuupaev} onChange={handleFilterChange} />
              </div>
              <div className="filtriRuhm hindRuhm">
                <label>Hind:</label>
                <div className="hinnaVahemik">
                  <input type="number" name="hind_min" value={filters.hind.min} onChange={handleFilterChange} placeholder="Min" />
                  <span>-</span>
                  <input type="number" name="hind_max" value={filters.hind.max} onChange={handleFilterChange} placeholder="Max" />
                  <span>€</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lennudInfo">
            {loading && <p>Laadimine...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && <FlightList flights={flights} />}
          </div>
        </section>
      </main>

      <footer className="flights-footer">
        <p>&copy; {new Date().getFullYear()} LennuPortaal | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Flights;
