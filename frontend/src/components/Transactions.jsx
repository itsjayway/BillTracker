import React, { useState, useEffect } from 'react';
// import Table from 'react-bootstrap/Table';
import { Table } from 'antd';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Transactions() {
  const [data, setData] = useState([{}]);
  // eslint-disable-next-line no-unused-vars
  const [beginDate, setBeginDate] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [endDate, setEndDate] = useState('');
  const [trigger, setTrigger] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  const [allTransactionsShown, setAllTransactionsShown] = useState(true);

  const handleToggleAllTransactions = () => {
    setAllTransactionsShown(!allTransactionsShown);
  };

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

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

  useEffect(() => {
    setDataSource(data.map((transaction, index) => ({
      // eslint-disable-next-line no-underscore-dangle
      key: `${transaction.account_id}-${index + 1}`,
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      time: transaction.time,
      notes: transaction.notes,
    })));
  }, [data]);

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
  }, [beginDate, endDate]);

  return (
    <>

      <Form>

        <Container>
          <Row>
            <Col>
              <Form.Label>Begin Date</Form.Label>
              <Form.Control
                type="date"
                name="beginDate"
                value={beginDate}
                onChange={(e) => setBeginDate(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Col>
            <Col>
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
            </Col>
          </Row>
        </Container>
      </Form>
      {/* button to clear dates, set beginDate and endDate to '' and fetch all transactions */}

      <h3>
        Transaction History
      </h3>

      {data.length > 0 && (
      <span style={
            allTransactionsShown
              ? { width: '100%', minHeight: '300px' }
              : {
                width: '100%', height: '32vh', minHeight: '300px',
              }

          }
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={
            allTransactionsShown ? false
              : {
                pageSize:

                Math.max(3, Math.floor((windowSize.innerHeight * 0.3) / 70)),
              }
            }
          bordered
        />
      </span>
      )}
      <h4>
        Total amount paid:
        $
        {
        data.reduce((total, transaction) => total + parseFloat(transaction.amount), 0, 0).toFixed(2)
      }
      </h4>
    </>
  );
}

export default Transactions;
