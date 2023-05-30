import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

function Transactions() {
  const [data, setData] = useState([{}]);
  useEffect(() => {
    fetch('/get_all_transactions')
      .then((response) => response.json())
      .then((result) => {
        setData(result.transactions);
      });
    // setTransactions(data);
  }, []);
  console.log(data);

  return (
    <>
      <h3>Transaction History</h3>
      {data.length > 0 && (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Time</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction) => (
          // eslint-disable-next-line no-underscore-dangle
            <tr key={transaction._id}>
              <td>{transaction.name}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
              <td>{transaction.time}</td>
              <td>{transaction.notes}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      )}
      <h4>
        Total amount paid:
        $
        {
        data.reduce((total, transaction) => total + parseFloat(transaction.amount), 2, 0).toFixed(2)
      }
      </h4>
    </>
  );
}

export default Transactions;
