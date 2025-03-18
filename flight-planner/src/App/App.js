import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home/Home';
import Flights from '../Pages/Flights/Flights';
import Seats from '../Pages/Seats/Seats';

function App() {
  return (
    <Router>
      <Routes>
        {/* Avaleht */}
        <Route path="/" element={<Home />}/>

        {/* Lendude otsing ja kuvamine */}
        <Route path="/flights" element={<Flights />} />

        {/* Istekohtade valimine (flightId kaudu) */}
        <Route path="/seats/:flightId" element={<Seats />} />
      </Routes>
    </Router>
  );
}

export default App;
