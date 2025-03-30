import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Seats.css';

function Seats() {
  const { flightId } = useParams();
  const navigate = useNavigate();

  // Olekud istekohtade kaardile ja valitud istmetele
  const [seatMap, setSeatMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [valitudIstmed, setValitudIstmed] = useState([]);
  const [reisijateArv, setReisijateArv] = useState(1);
  const [flightInfo, setFlightInfo] = useState(null);
  
  // Kasutaja eelistused istekohade soovitamiseks
  const [eelistused, setEelistused] = useState({
    aknaKoht: false,
    rohkemJalaruumi: false,
    lahemValjapasule: false,
    istmedKorvuti: true
  });

  // Soovitatud istmed eelistuste põhjal
  const [soovitusedIstmed, setSoovitusedIstmed] = useState([]);

  useEffect(() => {
    // Laadi lennu teave
    fetchFlightInfo();
    
    // Laadi istekohtade kaart (tavaliselt backendist)
    generateSeatMap();
  }, [flightId]);

  // Mõju, mis uuendab soovitusi, kui eelistused muutuvad
  useEffect(() => {
    if (seatMap.length > 0) {
      soovitaIstekohad();
    }
  }, [eelistused, reisijateArv, seatMap]);

  // Laadi lennu teave
  const fetchFlightInfo = async () => {
    try {
      // Tõelises rakenduses oleks see backendi päring
      setFlightInfo({
        id: flightId,
        origin: 'Tallinn',
        destination: 'Pariis',
        flightNumber: 'EE1234',
        departureTime: '12:35',
        arrivalTime: '14:20',
        date: '2025-04-15'
      });
    } catch (error) {
      setError('Viga lennu info laadimisel');
      console.error(error);
    }
  };

  // Loo näidis-istekohtade kaart (tuleks tavaliselt backendist)
  const generateSeatMap = () => {
    setLoading(true);
    
    try {
      // Loo realistlik lennukipaigutus 20 reaga
      // Rea konfiguratsioon: 3-3 (A, B, C - D, E, F)
      const rows = 20;
      const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const exitRows = [10, 11]; // Väljapääsu rea paigutus
      
      let generatedMap = [];
      
      for (let i = 1; i <= rows; i++) {
        let currentRow = [];
        
        for (let j = 0; j < seatLetters.length; j++) {
          // Lisa vahekäik keskel (C ja D vahele)
          if (j === 3) {
            currentRow.push({
              type: 'aisle',
              id: `aisle-${i}`
            });
          }
          
          const seatId = `${i}${seatLetters[j]}`;
          
          // Juhuslik istekohtade hõivatus (umbes 40% istmeid hõivatud)
          const isOccupied = Math.random() < 0.4;
          
          // Määratle istekohtade tüübid
          const isWindowSeat = j === 0 || j === seatLetters.length - 1;
          const isExitRowSeat = exitRows.includes(i);
          const isExtraLegroom = i === 1 || exitRows.includes(i) || i === rows;
          
          currentRow.push({
            id: seatId,
            label: seatId,
            status: isOccupied ? 'hoivatud' : 'vaba',
            position: seatLetters[j],
            isWindow: isWindowSeat,
            isExitRow: isExitRowSeat,
            isExtraLegroom: isExtraLegroom,
            rowNum: i
          });
        }
        
        generatedMap.push(currentRow);
      }
      
      setSeatMap(generatedMap);
      setLoading(false);
    } catch (error) {
      setError('Viga istekohtade laadimisel');
      console.error(error);
      setLoading(false);
    }
  };

  // Soovita istekohti kasutaja eelistuste põhjal
  const soovitaIstekohad = () => {
    // Lähtesta varasemad soovitused
    setSoovitusedIstmed([]);
    
    if (seatMap.length === 0) return;
    
    let availableSeats = [];
    
    // Kogu kõik vabad istmed
    seatMap.forEach(row => {
      row.forEach(seat => {
        if (seat.type !== 'aisle' && seat.status === 'vaba') {
          availableSeats.push(seat);
        }
      });
    });
    
    // Filtreeri istmed eelistuste põhjal
    let filteredSeats = [...availableSeats];
    
    if (eelistused.aknaKoht) {
      filteredSeats = filteredSeats.filter(seat => seat.isWindow);
    }
    
    if (eelistused.rohkemJalaruumi) {
      filteredSeats = filteredSeats.filter(seat => seat.isExtraLegroom);
    }
    
    if (eelistused.lahemValjapasule) {
      filteredSeats = filteredSeats.filter(seat => seat.isExitRow);
    }
    
    // Sorteeri rea numbri järgi, et grupeerida istmed koos, kui vajalik
    filteredSeats.sort((a, b) => a.rowNum - b.rowNum);
    
    // Mitme reisija korral, kes soovivad koos istuda
    if (reisijateArv > 1 && eelistused.istmedKorvuti) {
      // Leia kõrvuti olevad vabad istmed
      const adjacentSeats = findAdjacentSeats(filteredSeats, reisijateArv);
      if (adjacentSeats.length > 0) {
        setSoovitusedIstmed(adjacentSeats.map(seat => seat.id));
        return;
      }
    }
    
    // Kui sobivat gruppi ei leitud või üksik reisija
    // Vali parimad individuaalsed istmed
    const recommendedSeats = filteredSeats.slice(0, reisijateArv);
    setSoovitusedIstmed(recommendedSeats.map(seat => seat.id));
  };

  // Leia kõrvuti olevad vabad istmed
  const findAdjacentSeats = (availableSeats, count) => {
    // Grupeerige istmed ridade kaupa
    const seatsByRow = {};
    availableSeats.forEach(seat => {
      if (!seatsByRow[seat.rowNum]) {
        seatsByRow[seat.rowNum] = [];
      }
      seatsByRow[seat.rowNum].push(seat);
    });
    
    // Otsi kõrvuti olevaid istekohti samas reas
    for (const rowNum in seatsByRow) {
      const rowSeats = seatsByRow[rowNum];
      
      // Sorteeri istme asukoha järgi, et tagada kõrvuti olemine
      rowSeats.sort((a, b) => {
        const positions = ['A', 'B', 'C', 'D', 'E', 'F'];
        return positions.indexOf(a.position) - positions.indexOf(b.position);
      });
      
      // Kontrolli järjestikuseid istekohti
      for (let i = 0; i <= rowSeats.length - count; i++) {
        const positions = rowSeats.slice(i, i + count).map(s => s.position);
        
        // Jäta kontrollimata, kui ületatakse vahekäiku (C-lt D-le)
        let isConsecutive = true;
        for (let j = 1; j < positions.length; j++) {
          const curr = positions[j].charCodeAt(0);
          const prev = positions[j-1].charCodeAt(0);
          
          if (!(prev === 'C'.charCodeAt(0) && curr === 'D'.charCodeAt(0))) {
            if (curr - prev !== 1) {
              isConsecutive = false;
              break;
            }
          }
        }
        
        if (isConsecutive) {
          return rowSeats.slice(i, i + count);
        }
      }
    }
    
    return []; // Kõrvuti olevaid istekohti ei leitud
  };

  // Käsitle eelistuste muutumist
  const handleEelistusMuutus = (e) => {
    const { name, checked } = e.target;
    setEelistused(prev => ({ ...prev, [name]: checked }));
  };

  // Käsitle reisijate arvu muutumist
  const handleReisijateArvMuutus = (e) => {
    setReisijateArv(parseInt(e.target.value) || 1);
    setValitudIstmed([]); // Lähtesta valitud istmed, kui reisijate arv muutub
  };

  // Lülita istme valik
  const toggleIste = (seat) => {
    if (!seat || seat.type === 'aisle' || seat.status === 'hoivatud') return;
  
    const seatId = seat.id;
  
    if (valitudIstmed.includes(seatId)) {
      setValitudIstmed(valitudIstmed.filter(id => id !== seatId));
    } else {
      if (valitudIstmed.length < reisijateArv) {
        setValitudIstmed([...valitudIstmed, seatId]);
      } else {
        // Asenda varasemad valikud, kui täis
        setValitudIstmed([seatId]);
      }
    }
  };

  // Kontrolli, kas istekoht on soovitatud
  const isSeatRecommended = (seatId) => {
    return soovitusedIstmed.includes(seatId);
  };

  // Rakenda soovitusi valikule
  const valiSoovitusedIstmed = () => {
    // Vali ainult kuni reisijate arvuni
    const selectableRecommendations = soovitusedIstmed.slice(0, reisijateArv);
    setValitudIstmed(selectableRecommendations);
  };

  // Broneeri lennu piletid koos valitud istmetega
  const broneeriPiletid = () => {
    navigate('/booking-confirmation', {
      state: { flightInfo, valitudIstmed }
    });
  };
  
  // Hangi CSS klassi nimi istme kuvamiseks
  const getSeatClass = (seat) => {
    if (!seat || seat.type === 'aisle') return 'vahekäik';
    
    let classes = ['istekoht', seat.status];
    
    if (valitudIstmed.includes(seat.id)) {
      classes.push('valitud');
    } else if (isSeatRecommended(seat.id)) {
      classes.push('soovitatud');
    }
    
    if (seat.isWindow) classes.push('aknakoht');
    if (seat.isExtraLegroom) classes.push('jalaruumiga');
    if (seat.isExitRow) classes.push('valjapaasu');
    
    return classes.join(' ');
  };

  // Kuvab rea numbri
  const renderRowNumber = (rowIndex) => {
    const firstSeat = seatMap[rowIndex].find(item => item.type !== 'aisle');
    return firstSeat ? firstSeat.rowNum : '';
  };

  return (
    <div className="seats-container">
      <header className="seats-header">
        <div className="logo">LennuPortaal</div>
        <nav>
          <ul>
            <li><a href="/">Avaleht</a></li>
            <li><a href="/flights">Lennud</a></li>
            <li><a href="#" className="active">Istekohad</a></li>
          </ul>
        </nav>
      </header>

      <section className="seats-title">
        <h1>Istekohtade valimine</h1>
        {flightInfo && (
          <p>
            {flightInfo.origin} → {flightInfo.destination} | {flightInfo.flightNumber} | {flightInfo.date} | {flightInfo.departureTime}
          </p>
        )}
      </section>

      <main className="seats-main">
        {loading ? (
          <div className="loading">Istekohtade laadimine...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {/* Eelistuste sektsioon */}
            <section className="preferences-section">
              <div className="preferences-panel">
                <h2>Istekoha eelistused</h2>
                
                <div className="preference-options">
                  <div className="preferences-row">
                    <div className="preference-group">
                      <label htmlFor="reisijateArv">Reisijate arv: </label>
                      <select
                        id="reisijateArv"
                        value={reisijateArv}
                        onChange={handleReisijateArvMuutus}
                      >
                        {[1,2,3,4,5,6].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'reisija' : 'reisijat'}</option>
                        ))}
                      </select>
                    </div>
                    <div className="preference-group checkboxes">
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id="aknaKoht"
                          name="aknaKoht"
                          checked={eelistused.aknaKoht}
                          onChange={handleEelistusMuutus}
                        />
                        <label htmlFor="aknaKoht">Aknakoht</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id="rohkemJalaruumi"
                          name="rohkemJalaruumi"
                          checked={eelistused.rohkemJalaruumi}
                          onChange={handleEelistusMuutus}
                        />
                        <label htmlFor="rohkemJalaruumi">Rohkem jalaruumi</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id="lahemValjapasule"
                          name="lahemValjapasule"
                          checked={eelistused.lahemValjapasule}
                          onChange={handleEelistusMuutus}
                        />
                        <label htmlFor="lahemValjapasule">Lähemal väljapääsule</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id="istmedKorvuti"
                          name="istmedKorvuti"
                          checked={eelistused.istmedKorvuti}
                          onChange={handleEelistusMuutus}
                          disabled={reisijateArv <= 1}
                        />
                        <label htmlFor="istmedKorvuti" className={reisijateArv <= 1 ? 'disabled' : ''}>
                          Istmed kõrvuti
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="recommendation-actions">
                    {soovitusedIstmed.length > 0 && (
                      <button className="vali-soovitused-button" onClick={valiSoovitusedIstmed}>
                        Vali soovitatud istekohad
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Legend */}
            <div className="legend">
              <div className="legend-item">
                <div className="legend-mark vaba"></div>
                <span>Vaba</span>
              </div>
              <div className="legend-item">
                <div className="legend-mark hoivatud"></div>
                <span>Hõivatud</span>
              </div>
              <div className="legend-item">
                <div className="legend-mark soovitatud"></div>
                <span>Soovitatud</span>
              </div>
              <div className="legend-item">
                <div className="legend-mark valitud"></div>
                <span>Valitud</span>
              </div>
              <div className="legend-item">
                <div className="legend-mark aknakoht"></div>
                <span>Aknakoht</span>
              </div>
              <div className="legend-item">
                <div className="legend-mark jalaruumiga"></div>
                <span>Rohkem jalaruumi</span>
              </div>
              <div className="legend-item">
                <div className="legend-mark valjapaasu"></div>
                <span>Väljapääsu juures</span>
              </div>
            </div>
            
            {/* Lennuki visualiseerimine */}
            <div className="airplane-container">
              <div className="airplane-nose"></div>
              <div className="airplane-body">
                {/* Esiklass */}
                <div className="cabin-section">
                  <div className="section-label">Esiklass</div>
                  {seatMap.slice(0, 2).map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className={`row ${seatMap[rowIndex][0].isExtraLegroom ? 'extra-legroom-row' : ''}`}>
                      <div className="row-number">{renderRowNumber(rowIndex)}</div>
                      {row.map((seat, seatIndex) => (
                        <div
                          key={`seat-${rowIndex}-${seatIndex}`}
                          className={getSeatClass(seat)}
                          onClick={() => toggleIste(seat)}
                          title={seat && seat.type !== 'aisle' ? 
                            `Koht: ${seat.label}${seat.isWindow ? ' | Aknakoht' : ''}${seat.isExtraLegroom ? ' | Rohkem jalaruumi' : ''}${seat.isExitRow ? ' | Väljapääsu juures' : ''}` : ''}
                        >
                          {seat && seat.type !== 'aisle' ? seat.label : ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                <div className="cabin-divider"></div>
                
                {/* Äriklass */}
                <div className="cabin-section">
                  <div className="section-label">Äriklass</div>
                  {seatMap.slice(2, 5).map((row, rowIndex) => (
                    <div key={`row-${rowIndex + 2}`} className={`row ${seatMap[rowIndex + 2][0].isExtraLegroom ? 'extra-legroom-row' : ''}`}>
                      <div className="row-number">{renderRowNumber(rowIndex + 2)}</div>
                      {row.map((seat, seatIndex) => (
                        <div
                          key={`seat-${rowIndex + 2}-${seatIndex}`}
                          className={getSeatClass(seat)}
                          onClick={() => toggleIste(seat)}
                          title={seat && seat.type !== 'aisle' ? 
                            `Koht: ${seat.label}${seat.isWindow ? ' | Aknakoht' : ''}${seat.isExtraLegroom ? ' | Rohkem jalaruumi' : ''}${seat.isExitRow ? ' | Väljapääsu juures' : ''}` : ''}
                        >
                          {seat && seat.type !== 'aisle' ? seat.label : ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                <div className="cabin-divider"></div>
                
                {/* Turistiklass */}
                <div className="cabin-section">
                  <div className="section-label">Turistiklass</div>
                  {seatMap.slice(5).map((row, rowIndex) => (
                    <div 
                      key={`row-${rowIndex + 5}`} 
                      className={`row ${seatMap[rowIndex + 5][0].isExtraLegroom ? 'extra-legroom-row' : ''} ${seatMap[rowIndex + 5][0].isExitRow ? 'exit-row' : ''}`}
                    >
                      <div className="row-number">{renderRowNumber(rowIndex + 5)}</div>
                      {row.map((seat, seatIndex) => (
                        <div
                          key={`seat-${rowIndex + 5}-${seatIndex}`}
                          className={getSeatClass(seat)}
                          onClick={() => toggleIste(seat)}
                          title={seat && seat.type !== 'aisle' ? 
                            `Koht: ${seat.label}${seat.isWindow ? ' | Aknakoht' : ''}${seat.isExtraLegroom ? ' | Rohkem jalaruumi' : ''}${seat.isExitRow ? ' | Väljapääsu juures' : ''}` : ''}
                        >
                          {seat && seat.type !== 'aisle' ? seat.label : ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="airplane-tail"></div>
            </div>
            
            {/* Valitud istekohtade info */}
            <div className="selected-seats-info">
              <div className="selected-info">
                <p>
                  Valitud istekohad: {valitudIstmed.length > 0 ? valitudIstmed.join(', ') : 'Pole istekohti valitud'} 
                  ({valitudIstmed.length}/{reisijateArv})
                </p>
              </div>
              
              <button
                className="book-button"
                disabled={valitudIstmed.length !== reisijateArv}
                onClick={broneeriPiletid}
              >
                Broneeri piletid
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="seats-footer">
        <p>&copy; {new Date().getFullYear()} LennuPortaal | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Seats;
