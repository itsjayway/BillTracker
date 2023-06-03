import React, { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

function Summary() {
  const [bills, setBills] = useState([{}]);

  useEffect(() => {
    fetch('/get_all_bills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => setBills(data));
  }, []);

  const billArray = bills.map((bill) => (
    <tr>
      <td>{bill.name}</td>
      <td>{bill.account_id}</td>
      <td>{bill.last_transaction?.date}</td>
      <td>
        $
        {bill.last_transaction?.amount}
      </td>
      <td>
        <b>{bill.due_date}</b>
      </td>
      <td>{bill.last_transaction?.notes}</td>
    </tr>
  ));

  return (
    <Container fluid>
      <h1>Absarulislam BillTracker Summary</h1>
      <p>
        Generated on
        {' '}
        {new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Account Id</th>
              <th>Date last paid</th>
              <th>Amount last paid</th>
              <th>Upcoming Due Date</th>
              <th>Previous Transcation Note</th>
            </tr>
          </thead>
          <tbody>{billArray}</tbody>
        </Table>
      </Row>
    </Container>
  );
}

export default Summary;
