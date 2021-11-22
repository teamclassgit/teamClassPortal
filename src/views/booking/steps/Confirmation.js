// @packages
import CardCongratulations from "./CardCongratulations";
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';

const Confirmation = ({ stepper, customer, setConfirmation }) => {
  return (
    <Row className='match-height pt-1'>
      <Col md='12' lg='12' sm='12'>
        {customer && 
          <CardCongratulations 
            stepper={stepper} 
            setConfirmation={setConfirmation} 
            firstName={customer.name.split(" ")[0]} 
          />
        }
      </Col>
    </Row>
  );
};

export default Confirmation;

Confirmation.propTypes = {
  stepper: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  setConfirmation: PropTypes.func.isRequired
};