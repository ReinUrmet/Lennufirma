import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flightInfo, valitudIstmed } = location.state || {};
  const ticketsRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState('slide-in');

  if (!flightInfo || !valitudIstmed) {
    return (
      <div className="confirmation-container">
        <p>Piletite andmed puuduvad. Palun tehke uus broneering.</p>
        <button onClick={() => navigate('/flights')}>Tagasi lendude juurde</button>
      </div>
    );
  }

  const downloadPDF = () => {
    html2canvas(ticketsRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('lennupiletid.pdf');
    });
  };

  const handleNext = () => {
    if (currentIndex < valitudIstmed.length - 1) {
      setIsTransitioning(true);
      setSlideDirection('slide-out-left');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setSlideDirection('slide-in');
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setSlideDirection('slide-out-right');
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setSlideDirection('slide-in');
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <div className="confirmation-container">
      <h1>✈️ Broneering kinnitatud!</h1>
      <div className="tickets-container" ref={ticketsRef}>
        <div className={`ticket ${isTransitioning ? slideDirection : 'slide-in'}`}>
          <button className="arrow-button left" onClick={handlePrevious} disabled={currentIndex === 0}>
            ◀️
          </button>
          <div className="ticket-content">
            <img className="ticket-logo" src="/logo.png" alt="Lennufirma Logo"/>
            <h2>{flightInfo.origin} → {flightInfo.destination}</h2>
            <div className="ticket-info">
              <p><strong>Lennunumber:</strong> {flightInfo.flightNumber}</p>
              <p><strong>Kuupäev:</strong> {flightInfo.date}</p>
              <p><strong>Väljumisaeg:</strong> {flightInfo.departureTime}</p>
              <p><strong>Saabumisaeg:</strong> {flightInfo.arrivalTime}</p>
              <p><strong>Iste:</strong> {valitudIstmed[currentIndex]}</p>
            </div>
            <div className="ticket-barcode">
              <div className="barcode"></div>
            </div>
          </div>
          <button className="arrow-button right" onClick={handleNext} disabled={currentIndex === valitudIstmed.length - 1}>
            ▶️
          </button>
        </div>
      </div>

      <button className="download-button" onClick={downloadPDF}>
        📥 Lae alla PDF-ina
      </button>

      <button className="back-button" onClick={() => navigate('/')}>🏠 Tagasi avalehele</button>
    </div>
  );
};

export default BookingConfirmation;
