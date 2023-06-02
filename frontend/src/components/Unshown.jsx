import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

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
        position="top-end"
        style={{ zIndex: 1 }}
      >
        <Toast show={showToast} onClose={toggleShowToast}>
          <Toast.Header>
            <strong className="me-auto">Action needed!</strong>
          </Toast.Header>
          <Toast.Body>Please Refresh the page.</Toast.Body>
        </Toast>
      </ToastContainer>
      <Button variant="primary" onClick={toggleShow}>
        {show ? 'Hide' : 'Show'}
        {' '}
        hidden bills
      </Button>

      {show
        && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Account #</th>
                <th>Put back?</th>
              </tr>
            </thead>
            <tbody>
              {data.companies.map((bill) => (
                // eslint-disable-next-line no-underscore-dangle
                <tr key={bill._id}>
                  <td>{bill.name}</td>
                  <td>{bill.amount}</td>
                  <td>{bill.account_id}</td>
                  <td>{bill.due_date}</td>
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
        )}

    </>

  );
}

export default Unshown;
