import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import BillCard from './BillCard';

function BillCardGenerator() {
  const [bills, setBills] = useState([{}]);

  useEffect(() => {
    fetch('/get_all_bills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: false,
      }),
    })
      .then((response) => response.json())
      .then((data) => setBills(data));
  }, []);

  const billArray = bills.map((bill) => (
    // eslint-disable-next-line no-underscore-dangle
    <Col xs={12} sm={10} md={6} lg={6} xl={4} key={bill._id}>
      <BillCard
        // eslint-disable-next-line no-underscore-dangle
        key={bill._id}
        // eslint-disable-next-line no-underscore-dangle
        _id={bill._id}
        account_id={bill.account_id}
        due_date={bill.due_date}
        name={bill.name}
        url={bill.url}
        overdue={bill.overdue}
      />
    </Col>
  ));

  return (
    <Container className="justify-content-center">
      <Row>{billArray}</Row>
    </Container>
  );
}

export default BillCardGenerator;
