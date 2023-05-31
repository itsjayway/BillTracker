import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import BillCard from './BillCard';

function BillCardGenerator() {
  const [bills, setBills] = useState([{}]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/get_all_bills')
      .then((response) => response.json())
      .then((data) => setBills(data));
  }, []);

  // search box to filter bills by name

  const billArray = [];

  let i = 0;

  useEffect(() => {
    bills.forEach((bill) => {
      billArray.push(
        <BillCard
          key={`card-${i += 1}`}
          account_id={bill.account_id}
          due_date={bill.due_date}
          name={bill.name}
          url={bill.url}
          overdue={bill.overdue}
        />,
      );
    });
  });

  return (
    <>
      <Container id="search-container">
        <input
          type="text"
          placeholder="Search bills by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="primary"
          type="submit"
          onClick={() => {
          }}
        />
      </Container>
      <Container id="gen-container">
        <Row>{billArray}</Row>
      </Container>
    </>
  );
}

export default BillCardGenerator;
