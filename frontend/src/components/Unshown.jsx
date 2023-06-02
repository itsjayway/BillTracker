import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import WarningIcon from '@mui/icons-material/Warning';

function Unshown() {
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [data, setData] = useState({});

  const toggleShow = () => {
    setShow(!show);
  };
  const toggleShowToast = () => {
    setShowToast(!showToast);
  };

  useEffect(() => {
    fetch('/get_hidden_bills')
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      });
  }, []);

  //   console.log(data);
  return (
    <>
      <ToastContainer
        className="p-3"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1,
        }}
      >
        <Toast
          show={showToast}
          onClose={toggleShowToast}
          autohide
          delay={5000}
          style={
            {
              transition: 'all 0.3s ease-in-out',
            }
}

        >
          <Toast.Header>
            <WarningIcon />
            {' '}
            <strong className="me-auto">Pending Changes</strong>
          </Toast.Header>
          <Toast.Body>
            <Row>
              <Col xs={8}>
                Please refresh the page to see the changes.
              </Col>
              <Col xs={4}>
                <Button
                  variant="primary"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Refresh
                </Button>
              </Col>
            </Row>

          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Button variant="primary" onClick={toggleShow}>
        {show ? 'Hide' : 'Show'}
        {' '}
        paid-off bills
      </Button>

      {show
        && (
          <Container
            className="justify-content-center"
            style={{
              height: '90vh',
            }}
          >
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Account #</th>
                  <th># of Transactions</th>
                  <th>Payments</th>
                  <th>Total Amount Paid</th>
                  <th>Last Note</th>
                  <th>Put back?</th>
                </tr>
              </thead>
              <tbody>
                {data.companies?.map((bill) => (
                  // eslint-disable-next-line no-underscore-dangle
                  <tr key={bill._id}>
                    <td>{bill.name}</td>
                    <td>{bill.account_id}</td>
                    <td>{bill.transaction_count}</td>
                    <td>{bill.last_paid_date}</td>
                    <td
                      style={{
                        whiteSpace: 'pre-wrap',
                        width: '400px',
                      }}
                    >
                      {bill.payments}
                      {' '}
                      <i>
                        <b>
                          Total: $
                          {bill.total_paid}
                        </b>
                      </i>
                    </td>
                    <td
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {bill.notes}

                    </td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => {
                          fetch('/show_bill', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ account_id: bill.account_id }),
                            redirect: 'follow',
                          })
                            .then((response) => response.json())
                            .then(() => {
                              //   window.location.reload();
                              toggleShowToast();
                            });
                        }}
                      >
                        Put back
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        )}
    </>

  );
}

export default Unshown;
