import React, { useState, useEffect } from 'react';
// import Table from 'react-bootstrap/Table';
import { Table } from 'antd';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Transactions() {
  const [data, setData] = useState([{}]);
  const [beginDate, setBeginDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [trigger, setTrigger] = useState(false);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];
  let dataSource;

  const updateDataSource = (newData) => {
    dataSource = newData.map((transaction) => ({
      key: transaction._id,
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      time: transaction.time,
      notes: transaction.notes,
    }));
  };

  useEffect(() => {
    fetch('/get_all_transactions')
      .then((response) => response.json())
      .then((result) => {
        setData(result.transactions);
      });

    updateDataSource(data);
  }, [trigger]);

  useEffect(() => {
    fetch('/get_transactions_between_dates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        beginDate,
        endDate,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        setData(result.transactions);
      });

    updateDataSource(data);
  }, [beginDate, endDate]);

  return (
    <>
      <Form>

        <Form.Label>Begin Date</Form.Label>
        <Form.Control
          type="date"
          name="beginDate"
          onChange={(e) => setBeginDate(e.target.value)}
        />

        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          name="endDate"
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Form>
      {/* button to clear dates, set beginDate and endDate to '' and fetch all transactions */}
      <Button
        variant="primary"
        type="submit"
        onClick={() => {
          setBeginDate('');
          setEndDate('');
          setTrigger(!trigger);
        }}
      >
        Clear

      </Button>

      <h3>Transaction History</h3>
      {/* {data.length > 0 && (
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
      )} */}

      {data.length > 0 && (
      <Table dataSource={dataSource} columns={columns} />
      )}

      <h4>
        Total amount paid:
        $
        {
        data.reduce((total, transaction) => total + parseFloat(transaction.amount), 0, 0).toFixed(2)
        // data.reduce((total, transaction) => total + transaction.amount)
      }
      </h4>
    </>
  );
}

export default Transactions;
