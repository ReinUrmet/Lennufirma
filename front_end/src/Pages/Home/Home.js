import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  // Mõned näidisnõuanded, mida modaalaknas kuvada
  const tips = [
    "Vali lennuaeg varahommikul, et vältida suuremaid hilinemisi.",
    "Proovi erinevaid lennujaamu ümbruskonnas, et leida soodsamaid pileteid.",
    "Kontrolli pagasi piiranguid ja vali sobiv istekoht eelnevalt.",
    "Ära unusta reisikindlustust – see võib palju peavalu ära hoida.",
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState("");

  // Valib juhusliku nõuande massiivist ja avab modaalakna
  const handleTip = () => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
    setModalOpen(true);
  };

  return (
    <div className="home-container">
      {/* Päis */}
      <header className="home-header">
        <div className="logo">LennuPortaal</div>
        <nav>
          <ul>
            <li><Link to="/" className="active">Avaleht</Link></li>
            <li><Link to="/flights">Lennud</Link></li>
            <li><Link to="#">Istekohad</Link></li>
            <li><Link to="#">Kontakt</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero sektsioon taustapildi ja nupuvalikuga */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Planeeri oma järgmine lend</h1>
            <p>Avasta soodsad pakkumised ja vali just endale sobiv istekoht!</p>
            <div className="hero-buttons">
              {/* Lingib /flights lehele */}
              <Link to="/flights" className="btn-primary">Vaata lende</Link>
              {/* Avab juhusliku reisinõuande modaalakna */}
              <button onClick={handleTip} className="btn-secondary">Reisi nõuanne</button>
            </div>
          </div>
        </div>
      </section>

      {/* Näidis: Populaarsed sihtkohad */}
      <section className="featured-destinations">
        <h2>Populaarsed sihtkohad</h2>
        <div className="destinations-grid">
          <div className="destination-card">
            <img 
              src="https://th.bing.com/th/id/R.4e312752589af6f4da3d6cf28e2f9775?rik=6XvqwkBl8ue5ew&riu=http%3a%2f%2fphotos.wikimapia.org%2fp%2f00%2f03%2f67%2f44%2f20_full.jpg&ehk=tZ93i9NWQQUrD9mGvJIMN0tkrsdq1m1xzNI%2bJhdcGys%3d&risl=&pid=ImgRaw&r=0" 
              alt="Pariis" 
            />
            <div className="destination-info">
              <h3>Pariis</h3>
              <Link to="/flights?destination=pariis" className="destination-link">
                Vaata lende
              </Link>
            </div>
          </div>

          <div className="destination-card">
            <img 
              src="https://lp-cms-production.imgix.net/2019-06/55425108.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4" 
              alt="London" 
            />
            <div className="destination-info">
              <h3>London</h3>
              <Link to="/flights?destination=london" className="destination-link">
                Vaata lende
              </Link>
            </div>
          </div>

          <div className="destination-card">
            <img 
              src="https://th.bing.com/th/id/OIP.kxBvHFyTyuIFV8IDL4FqFAHaE7?rs=1&pid=ImgDetMain" 
              alt="New York" 
            />
            <div className="destination-info">
              <h3>New York</h3>
              <Link to="/flights?destination=newyork" className="destination-link">
                Vaata lende
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reisi nõuande modaalaken */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setModalOpen(false)}>✕</button>
            <h2>Reisi nõuanne</h2>
            <p>{currentTip}</p>
          </div>
        </div>
      )}

      {/* Jalus */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} LennuPortaal | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Home;