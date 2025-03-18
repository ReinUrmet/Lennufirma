import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  // Filtrite state
  const [filtrid, setFiltrid] = useState({
    sihtkoht: '',
    kuupaev: '',
    hind: { min: '', max: '' }
  });

  // Lendude andmed
  const [lennud, setLennud] = useState([]);

  // Laadi lennud, kui filtrid muutuvad
  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtrid]);

  const fetchFlights = async () => {
    // Koosta päringu parameetrid
    const queryParams = new URLSearchParams();
    if (filtrid.sihtkoht) queryParams.append('destination', filtrid.sihtkoht);
    if (filtrid.kuupaev) queryParams.append('date', filtrid.kuupaev);
    if (filtrid.hind.min) queryParams.append('minPrice', filtrid.hind.min);
    if (filtrid.hind.max) queryParams.append('maxPrice', filtrid.hind.max);

    try {
      const response = await fetch(`/api/flights?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Viga lendude pärimisel');
      }
      const data = await response.json();
      setLennud(data);
    } catch (error) {
      console.error('Viga lennude laadimisel:', error);
    }
  };

  // Filtri muutuse handler
  const handleFiltriMuutus = (e) => {
    const { name, value } = e.target;
    if (name === 'hind_min' || name === 'hind_max') {
      setFiltrid({
        ...filtrid,
        hind: {
          ...filtrid.hind,
          [name === 'hind_min' ? 'min' : 'max']: value
        }
      });
    } else {
      setFiltrid({ ...filtrid, [name]: value });
    }
  };

  // Lendu valides suuname Seats-lehele
  const valiLend = (lendId) => {
    navigate(`/seats/${lendId}`);
  };

  // Lendude tabel/kaartide renderdamine
  const renderdaLendudeTabel = () => {
    if (lennud.length === 0) {
      return <p className="teade">Filtrile vastavaid lende ei leitud.</p>;
    }

    return (
      <div className="lennukaardid">
        {lennud.map((lend) => {
          // Näidislikult eeldame, et API tagastab väljumisaja jms
          const kuupaev = new Date(lend.vaaljumisaeg).toLocaleDateString('et-EE');
          const kellaaeg = new Date(lend.vaaljumisaeg).toLocaleTimeString('et-EE', {
            hour: '2-digit',
            minute: '2-digit'
          });
          const saabumisaeg = new Date(lend.vaaljumisaeg);
          saabumisaeg.setHours(saabumisaeg.getHours() + lend.kestvus);
          const saabumisKellaaeg = saabumisaeg.toLocaleTimeString('et-EE', {
            hour: '2-digit',
            minute: '2-digit'
          });

          // Lennufirma logo
          const firmaLogo = lend.lennukompanii?.charAt(0) ?? 'L';

          return (
            <div
              key={lend.id}
              className="lennukaart"
              onClick={() => valiLend(lend.id)}
            >
              <div className="lennufirma">
                <div className="lennufirma-logo">{firmaLogo}</div>
                <span>{lend.lennukompanii}</span>
              </div>

              <div className="lennu-info">
                <div className="vahemik">
                  <div className="aeg">{kellaaeg}</div>
                  <div className="koht">{lend.lahkumiskoht}</div>
                </div>

                <div className="kestus">
                  <div className="kestus-tekst">{lend.kestvus}h</div>
                  <div className="kestus-joon"></div>
                  <div className="kestus-tekst">{kuupaev}</div>
                </div>

                <div className="vahemik">
                  <div className="aeg">{saabumisKellaaeg}</div>
                  <div className="koht">{lend.sihtkoht}</div>
                </div>
              </div>

              <div className="lennu-detailid">
                <div className="lennu-nr">Lennu nr: {lend.lennuNumber}</div>
                <div className="lennu-hind">
                  <span className="hind-summa">{lend.hind}</span>
                  <span className="hind-currency">€</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="app">
        <div className="navbar">
            <header className="pealkiri">
                <a href="/" className="brand-link">
                <h1>ReinAIR</h1>
                </a>
            </header>
            <div className="nav-links">
                <a href="/" className="nav-link">
                <h3>Broneeri</h3>
                </a>
                <a href="#" className="nav-link">
                <h3>Halda</h3>
                </a>
            </div>
            <a href="#" className="login-button">
                <h2>Logi Sisse</h2>
            </a>
        </div>




      <main className="sisu">
        <section className="sektsioon otsingusektsioon">
          <h2>Leia lend</h2>

          <div className="filtrid">
            <div className="filtriRuhm">
              <label htmlFor="sihtkoht">Sihtkoht:</label>
              <input
                type="text"
                id="sihtkoht"
                name="sihtkoht"
                value={filtrid.sihtkoht}
                onChange={handleFiltriMuutus}
                placeholder="Sisesta sihtkoht"
              />
            </div>

            <div className="filtriRuhm">
              <label htmlFor="kuupaev">Kuupäev:</label>
              <input
                type="date"
                id="kuupaev"
                name="kuupaev"
                value={filtrid.kuupaev}
                onChange={handleFiltriMuutus}
              />
            </div>

            <div className="filtriRuhm hindRuhm">
              <label>Hind:</label>
              <div className="hinnaVahemik">
                <input
                  type="number"
                  name="hind_min"
                  value={filtrid.hind.min}
                  onChange={handleFiltriMuutus}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  name="hind_max"
                  value={filtrid.hind.max}
                  onChange={handleFiltriMuutus}
                  placeholder="Max"
                />
                <span>€</span>
              </div>
            </div>
          </div>

          <div className="lennudInfo">
            <h3>Saadaolevad lennud</h3>
            {renderdaLendudeTabel()}
          </div>
        </section>
      </main>

      <footer className="jalus">
        <p>&copy; {new Date().getFullYear()} - Lennureisija Planeerimisrakendus</p>
      </footer>
    </div>
  );
}

export default Home;
