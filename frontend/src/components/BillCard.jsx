import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
// import Row from 'react-bootstrap/esm/Row';
// import Col from 'react-bootstrap/esm/Col';

function BillCard(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [submitShown, setSubmitShown] = useState(false);

  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');

  const data = { ...props };
  const dateColor = data.overdue === 1 ? 'e743c3' : '0';

  const handleDelete = (accountId) => () => {
    const postData = {
      accountId,
    };

    fetch('/delete_bill', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload();
      });
  };

  const handleSubmit = () => {
    const postData = {
      account_id: data.account_id,
      amount,
      notes,
    };

    fetch('/pay_bill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload();
      });
    handleClose();
  };

  const paymentModal = (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{data.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Account Number:
          {' '}
          {data.account_id}

        </p>
        <p>
          Due Date:
          {' '}
          {data.due_date}
          {' '}
          -
          {' '}
          (
          {data.overdue ? 'OVERDUE' : 'ON-TIME'}
          )
        </p>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control
              aria-label="Amount"
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Notes</InputGroup.Text>
            <Form.Control
              aria-label="Notes"
              onChange={(e) => setNotes(e.target.value)}
            />
          </InputGroup>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Confirm payment"
              onChange={() => setSubmitShown(!submitShown)}
            />
          </Form.Group>

          { submitShown
          && (
          <Button variant="primary" type="submit">
            Submit
          </Button>
          )}
        </Form>
        <Modal.Footer>
          <h4>
            Today is
            {' '}
            {`${new Date().toLocaleDateString()}`}
          </h4>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
  return (
    <>
      {paymentModal}

      <Card style={{ width: '18rem', margin: '2em' }}>
        <Card.Header style={{ display: 'flex' }}>
          {data.name}
          {' '}
          <span style={{ marginLeft: 'auto' }}>
            <Button
              variant="gray"
              onClick={handleDelete(data.account_id)}
            >
              X

            </Button>
          </span>
        </Card.Header>
        <Card.Body>
          <Card.Subtitle>
            #
            {data.account_id}
          </Card.Subtitle>

          <Card.Title>
            <span style={{ color: `#${dateColor}` }}>{data.due_date}</span>
          </Card.Title>

          <Card.Link href={data.url} onClick={handleShow} target="_blank">
            Pay
          </Card.Link>
        </Card.Body>
      </Card>
    </>
  );
}

export default BillCard;
