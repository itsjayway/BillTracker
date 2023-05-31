import './App.css';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Home from './components/Home';
import Summary from './components/Summary';
import Transactions from './components/Transactions';
import Unshown from './components/Unshown';

function App() {
  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">BillTracker</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <Navbar.Brand href="/">Home</Navbar.Brand>
          </Navbar.Text>
          <Navbar.Text>
            <Navbar.Brand href="/summary">Summary</Navbar.Brand>
          </Navbar.Text>
          <Navbar.Text>
            <Navbar.Brand href="/transactions">Transactions</Navbar.Brand>
          </Navbar.Text>
          <Navbar.Text>
            <Navbar.Brand href="/unshown">Paid Off</Navbar.Brand>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/unshown" element={<Unshown />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
