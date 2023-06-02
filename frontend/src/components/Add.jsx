import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function Add() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState('');
  const [acctNum, setAcctNum] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [url, setURL] = useState('');

  const handleSubmit = () => {
    const selectedDate = new Date(dueDate);
    const data = {
      name: name || 'No name',
      account_id: acctNum || 'No account number',
      due_date: selectedDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }) || 'No due date',
      url: url || 'No URL',
    };

    fetch('/create_bill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload();
      });
    handleClose();
  };

  const modal = (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create new tracker</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Details
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>Name</InputGroup.Text>
            <Form.Control
              id="create-name"
              aria-label="Text"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Account #</InputGroup.Text>
            <Form.Control
              id="create-acctnum"
              aria-label="Account Number"
              onChange={(e) => setAcctNum(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Due Date</InputGroup.Text>
            <Form.Control
              id="create-duedate"
              type="date"
              aria-label="Due Date"
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Link to website</InputGroup.Text>
            <Form.Control
              id="create-url"
              aria-label="Website URL"
              onChange={(e) => setURL(e.target.value)}
              required
            />
          </InputGroup>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <h4>
          Today is
          {' '}
          {`${new Date().toLocaleDateString()}`}
        </h4>
      </Modal.Footer>
    </Modal>
  );
  return (
    <>
      {modal}
      <Button onClick={handleShow}>Add new tracker</Button>
    </>
  );
}
export default Add;
