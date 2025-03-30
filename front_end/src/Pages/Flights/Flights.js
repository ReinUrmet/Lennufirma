import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import FlightList from '../../Fetch/Flightlist';
import './Flights.css';

// Komponendi Flights eesmärk on kuvada lennude nimekiri ning pakkuda filtrite abil otsinguvõimalust
function Flights() {
  const navigate = useNavigate(); // Navigeerimiseks erinevate lehtede vahel
  const location = useLocation(); // Hoiab infot praeguse URL-i ja selle parameetrite kohta

  // Võtame URL-ist parameetri 'destination', et seadistada vaikimisi sihtkoht
  const queryParams = new URLSearchParams(location.search);
  const destinationParam = queryParams.get('destination');

  // Olekud filtrite haldamiseks: alguskoht, sihtkoht, kuupäev ja hindade vahemik
  const [filters, setFilters] = useState({
    alguskoht: '',
    sihtkoht: destinationParam || '',
    kuupaev: '',
    hind: { min: '', max: '' },
  });

  // Olekud lennude andmete, veateate ja laadimise oleku jaoks
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect, mis käivitub iga kord, kui 'filters' muutuvad, et uuendada lennude nimekirja
  useEffect(() => {
    fetchFlights();
  }, [filters]);

  // Funktsioon lennude andmete toomiseks API-st
  const fetchFlights = async () => {
    setLoading(true);    // Näitab, et andmeid laaditakse
    setFlights([]);      // Tühjendab eelmised lennud enne uue päringu alustamist

    // Ehita päringu parameetrid vastavalt kasutaja sisestatud filtritele
    const queryParams = new URLSearchParams();
    if (filters.alguskoht) queryParams.append('origin', filters.alguskoht);
    if (filters.sihtkoht) queryParams.append('destination', filters.sihtkoht);
    if (filters.kuupaev) queryParams.append('date', filters.kuupaev);
    if (filters.hind.min) queryParams.append('minPrice', filters.hind.min);
    if (filters.hind.max) queryParams.append('maxPrice', filters.hind.max);

    try {
      // Saadab päringu API-le ning kontrollib, kas vastus on õnnestunud
      const response = await fetch(`/api/flights?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Error fetching flights');
      const data = await response.json();
      setFlights(data);  // Salvestab saadud lennud olekusse
      setError(null);    // Kui andmed laaditi edukalt, eemaldab veateate
    } catch (err) {
      console.error(err);
      setError(err);     // Kui esineb viga, salvestab veateate
    } finally {
      setLoading(false); // Lõpetab laadimise oleku
    }
  };

  // Funktsioon, mis käitleb filtriväärtuste muutumist sisendväljade kaudu
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Eraldi käsitle hindade min ja max väärtuseid
    if (name === 'hind_min' || name === 'hind_max') {
      setFilters((prev) => ({
        ...prev,
        hind: {
          ...prev.hind,
          [name === 'hind_min' ? 'min' : 'max']: value,
        },
      }));
    } else {
      // Muudab teisi filtreid otse
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="flights-container">
      {/* Lehe päis, mis sisaldab logo ja navigeerimislinke */}
      <header className="flights-header">
        <div className="logo">LennuPortaal</div>
        <nav>
          <ul>
            <li><Link to="/">Avaleht</Link></li>
            <li><Link to="/flights" className="active">Lennud</Link></li>
            <li><Link to="#">Istekohad</Link></li>
          </ul>
        </nav>
      </header>

      {/* Pealkirja sektsioon, kus kuvatakse lehe pealkiri ja alltekst */}
      <section className="flights-title">
        <h1>Vali oma lend</h1>
        <p>Näidatud hinnad on 1 täiskasvanu piletile</p>
      </section>

      {/* Põhisisu, mis jaguneb otsingusektsiooniks ja lennude infot kuvavaks osaks */}
      <main className="flights-main">
        <section className="otsingusektsioon">
          {/* Filtrite paneel: siin saab kasutaja sisestada otsingutingimused */}
          <div className="filters-panel">
            <h2>Lennu filtrid</h2>
            <div className="filtrid">
              {/* Alguskoha sisestusväli */}
              <div className="filtriRuhm">
                <label htmlFor="alguskoht">Alguskoht:</label>
                <input
                  type="text"
                  id="alguskoht"
                  name="alguskoht"
                  value={filters.alguskoht}
                  onChange={handleFilterChange}
                  placeholder="Sisesta alguskoht"
                />
              </div>
              {/* Sihtkoha sisestusväli */}
              <div className="filtriRuhm">
                <label htmlFor="sihtkoht">Sihtkoht:</label>
                <input
                  type="text"
                  id="sihtkoht"
                  name="sihtkoht"
                  value={filters.sihtkoht}
                  onChange={handleFilterChange}
                  placeholder="Sisesta sihtkoht"
                />
              </div>
              {/* Kuupäeva sisestusväli */}
              <div className="filtriRuhm">
                <label htmlFor="kuupaev">Kuupäev:</label>
                <input
                  type="date"
                  id="kuupaev"
                  name="kuupaev"
                  value={filters.kuupaev}
                  onChange={handleFilterChange}
                />
              </div>
              {/* Hinna sisestusväli: minimaalse ja maksimaalse hinna määramine */}
              <div className="filtriRuhm hindRuhm">
                <label>Hind:</label>
                <div className="hinnaVahemik">
                  <input
                    type="number"
                    name="hind_min"
                    value={filters.hind.min}
                    onChange={handleFilterChange}
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="hind_max"
                    value={filters.hind.max}
                    onChange={handleFilterChange}
                    placeholder="Max"
                  />
                  <span>€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lennude info sektsioon: näitab laadimisteadet, veateadet või lennude nimekirja */}
          <div className="lennudInfo">
            {loading && <p>Laadimine...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && <FlightList flights={flights} />}
          </div>
        </section>
      </main>

      {/* Lehe jalus */}
      <footer className="flights-footer">
        <p>&copy; {new Date().getFullYear()} LennuPortaal | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Flights;
