import {Fragment} from 'react';
import {Col, Row} from 'reactstrap';
import WizardClassBooking from './WizardClassBooking';
import {useParams} from "react-router-dom";

const Booking = () => {

  const {id} = useParams();

  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <WizardClassBooking/>
        </Col>
      </Row>
    </Fragment>
  );
};
export default Booking;
