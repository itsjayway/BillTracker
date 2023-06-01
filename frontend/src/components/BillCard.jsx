/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Tooltip from '@mui/material/Tooltip';
// import Row from 'react-bootstrap/esm/Row';
// import Col from 'react-bootstrap/esm/Col';

function BillCard(props) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handlePaymentClose = () => setShowPaymentModal(false);
  const handlePaymentShow = () => setShowPaymentModal(true);

  const handleEditClose = () => setShowEditModal(false);
  const handleEditShow = () => setShowEditModal(true);

  const [submitPaymentShown, setSubmitPaymentShown] = useState(false);
  const [submitEditShown, setSubmitEditShown] = useState(false);

  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');

  const [editName, setEditName] = useState('');
  const [editAccountId, setEditAccountId] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editURL, setEditURL] = useState('');

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

  const handlePaymentSubmit = () => {
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
    handlePaymentClose();
  };

  const handleEditSubmit = () => {
    const postData = {
      // eslint-disable-next-line no-underscore-dangle
      _id: data._id,
      name: editName,
      account_id: editAccountId,
      due_date: editDueDate,
    };

    fetch('/edit_bill', {
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
  };

  const editModal = (
    <Modal show={showEditModal} onHide={handleEditClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Editting
          {' '}
          {data.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEditSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>ObjectId</InputGroup.Text>
            <Form.Control
              aria-label="Account #"
              disabled
              // eslint-disable-next-line no-underscore-dangle
              value={data._id}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              Name (
              {data.name}
              ):
            </InputGroup.Text>
            <Form.Control
              aria-label="Account #"
              onChange={(e) => setEditName(e.target.value)}
              placeholder={data.name}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              URL (
              {`${data.url?.slice(0, 20)}...`}
              ):
            </InputGroup.Text>
            <Form.Control
              aria-label="URL"
              onChange={(e) => setEditURL(e.target.value)}
              placeholder={data.url}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              Account # (
              {data.account_id}
              ):
            </InputGroup.Text>
            <Form.Control
              aria-label="Account #"
              onChange={(e) => setEditAccountId(e.target.value)}
              placeholder={data.account_id}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>{`Next Due Date (${data.due_date}):`}</InputGroup.Text>
            <Form.Control
              type="date"
              aria-label="Next Due Date"
              placeholder={data.due_date}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
          </InputGroup>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Confirm changes"
              onChange={() => setSubmitEditShown(!submitEditShown)}
            />
          </Form.Group>

          {submitEditShown && (
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

  const paymentModal = (
    <Modal show={showPaymentModal} onHide={handlePaymentClose}>
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
          - (
          {data.overdue ? 'OVERDUE' : 'ON-TIME'}
          )
        </p>
        <Form onSubmit={handlePaymentSubmit}>
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
              onChange={() => setSubmitPaymentShown(!submitPaymentShown)}
            />
          </Form.Group>

          {submitPaymentShown && (
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
      {editModal}
      <Card key={data.key} style={{ width: '18rem', margin: '2em' }}>
        <Card.Header style={{ display: 'flex' }}>
          {data.name}
          {' '}
          <span style={{ marginLeft: 'auto' }}>
            <Tooltip title="Edit">
              <Button variant="gray" onClick={handleEditShow}>
                <BorderColorIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Paid in Full">
              <Button variant="gray" onClick={handleDelete(data.account_id)}>
                <AssignmentTurnedInIcon />
              </Button>
            </Tooltip>
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

          <Card.Link
            href={data.url}
            onClick={handlePaymentShow}
            target="_blank"
          >
            Pay
          </Card.Link>
        </Card.Body>
      </Card>
    </>
  );
}

export default BillCard;
