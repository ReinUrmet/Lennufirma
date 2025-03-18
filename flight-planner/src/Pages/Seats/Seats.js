import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Seats.css';

function Seats() {
  const { flightId } = useParams(); // URL: /seats/:flightId

  const [seatMap, setSeatMap] = useState([]); 
  const [valitudIstmed, setValitudIstmed] = useState([]);
  const [reisijateArv, setReisijateArv] = useState(1);

  // Kasutaja eelistused – siin näidisena lokaalses seisundis
  const [eelistused, setEelistused] = useState({
    aknaKoht: false,
    rohkemJalaruumi: false,
    lahemValjapasule: false,
    istmedKorvuti: true
  });

  useEffect(() => {
    laeIstekohad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId, reisijateArv, eelistused]);

  // Lae seat map backendist
  const laeIstekohad = async () => {
    try {
      const params = new URLSearchParams({
        reisijateArv,
        aknaKoht: eelistused.aknaKoht,
        rohkemJalaruumi: eelistused.rohkemJalaruumi,
        lahemValjapasule: eelistused.lahemValjapasule,
        istmedKorvuti: eelistused.istmedKorvuti
      });

      const response = await fetch(`/api/flights/${flightId}/seats?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Viga istekohtade laadimisel');
      }
      const data = await response.json();
      setSeatMap(data);
    } catch (error) {
      console.error('Viga istekohtade pärimisel:', error);
    }
  };

  // Eelistuste muutmine
  const handleEelistusMuutus = (e) => {
    const { name, checked } = e.target;
    setEelistused({ ...eelistused, [name]: checked });
  };

  // Reisijate arvu muutmine
  const handleReisijateArvMuutus = (e) => {
    setReisijateArv(parseInt(e.target.value) || 1);
  };

  // Iste valimine
  const toggleIste = (seatId, seatStatus) => {
    if (seatStatus === 'hoivatud') return;
    if (valitudIstmed.includes(seatId)) {
      setValitudIstmed(valitudIstmed.filter((id) => id !== seatId));
    } else if (valitudIstmed.length < reisijateArv) {
      setValitudIstmed([...valitudIstmed, seatId]);
    }
  };

  // Näidis broneerimise nupp
  const broneeriIstmed = () => {
    // Siin teed POST-päringu backendile
    console.log('Broneerime istmed:', valitudIstmed);
  };

  return (
    <div className="app">
      <header className="pealkiri">
        <h1>Istekohtade valimine</h1>
      </header>

      <main className="sisu">
        <section className="sektsioon istekohaSektsioon">
          <h2>Lennule ID-ga: {flightId}</h2>

          <div className="valikud">
            <div className="reisijaArv">
              <label htmlFor="reisijateArv">Reisijate arv:</label>
              <select
                id="reisijateArv"
                value={reisijateArv}
                onChange={handleReisijateArvMuutus}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="eelistused">
              <label>Eelistused:</label>
              <div className="valikuteRuhm">
                <div className="valik">
                  <input
                    type="checkbox"
                    id="aknaKoht"
                    name="aknaKoht"
                    checked={eelistused.aknaKoht}
                    onChange={handleEelistusMuutus}
                  />
                  <label htmlFor="aknaKoht">Aknakoht</label>
                </div>

                <div className="valik">
                  <input
                    type="checkbox"
                    id="rohkemJalaruumi"
                    name="rohkemJalaruumi"
                    checked={eelistused.rohkemJalaruumi}
                    onChange={handleEelistusMuutus}
                  />
                  <label htmlFor="rohkemJalaruumi">Rohkem jalaruumi</label>
                </div>

                <div className="valik">
                  <input
                    type="checkbox"
                    id="lahemValjapasule"
                    name="lahemValjapasule"
                    checked={eelistused.lahemValjapasule}
                    onChange={handleEelistusMuutus}
                  />
                  <label htmlFor="lahemValjapasule">Lähemal väljapääsule</label>
                </div>

                <div className="valik">
                  <input
                    type="checkbox"
                    id="istmedKorvuti"
                    name="istmedKorvuti"
                    checked={eelistused.istmedKorvuti}
                    onChange={handleEelistusMuutus}
                    disabled={reisijateArv <= 1}
                  />
                  <label htmlFor="istmedKorvuti">Istmed kõrvuti</label>
                </div>
              </div>
            </div>
          </div>

          {/* Istekohtade renderdamine */}
          <div className="lennukiKontainer">
            <div className="lennukiNina"></div>
            <div className="lennukiKere">
              {seatMap.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="rida">
                  {row.map((seat) => (
                    <div
                      key={seat.id}
                      className={`istekoht ${seat.status} ${
                        valitudIstmed.includes(seat.id) ? 'valitud' : ''
                      }`}
                      onClick={() => toggleIste(seat.id, seat.status)}
                      title={`Koht: ${seat.label}`}
                    >
                      {seat.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="lennukiSaba"></div>
          </div>

          <div className="valitudInfo">
            <p>
              Valitud istekohad:{' '}
              {valitudIstmed.length > 0
                ? valitudIstmed.join(', ')
                : 'Pole istekohti valitud'}
            </p>
            <button
              className="bronneeriNupp"
              disabled={valitudIstmed.length !== reisijateArv}
              onClick={broneeriIstmed}
            >
              Broneeri piletid
            </button>
          </div>
        </section>
      </main>

      <footer className="jalus">
        <p>&copy; {new Date().getFullYear()} - Lennureisija Planeerimisrakendus</p>
      </footer>
    </div>
  );
}

export default Seats;
