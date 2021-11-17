import React, {Fragment} from 'react';
import {Col, Row} from 'reactstrap';
import CardCongratulations from "./CardCongratulations";

const Confirmation = ({stepper, type, customer, booking, setConfirmation}) => {
  return (
    <Fragment>
      <Row className='match-height pt-1'>
        <Col md='12' lg='12' sm='12'>
          {customer && <CardCongratulations stepper={stepper} setConfirmation={setConfirmation} firstName={customer.name.split(" ")[0]} />}
        </Col>
      </Row>
    </Fragment>
  );
};

export default Confirmation;
