import React from 'react';
import Container from 'react-bootstrap/Container';
import Add from './Add';
import BillCardGenerator from './BillCardGenerator';
import Transactions from './Transactions';
import Unshown from './Unshown';

function Home() {
  return (
    <Container id="main">
      <Add />
      <h3>
        Today is
        {' '}
        {new Date().toLocaleDateString()}
      </h3>
      <Container id="inner">
        <BillCardGenerator />
      </Container>
      <br />
      <Transactions />
      <br />
      <Unshown />
      <br />
    </Container>
  );
}

export default Home;
