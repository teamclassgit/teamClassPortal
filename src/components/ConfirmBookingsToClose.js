// @packages
import PropTypes from "prop-types";
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

// @scripts
import { closeManyBookingsOneReason } from "../services/BookingService";

const ConfirmBookingsToClose = ({toggle, closedReason, idBookingselected, onEditCompleted, setSelected }) => {

  return (
    <>
      <ModalHeader>
        Pay Attention
      </ModalHeader>
      <ModalBody className="py-3">
        <h5 className="text-center">Do you want to close selected bookings with reason:</h5>
        <p className="text-center">{closedReason}</p>
      </ModalBody>
      <ModalFooter>
        <Button
          className="float-right text-align-center ml-1"
          color="light"
          onClick={toggle}
        >
          Close
        </Button>
        <Button
          className="float-right text-align-center ml-1"
          color="primary"
          onClick={async () => {
            await closeManyBookingsOneReason(idBookingselected, closedReason);
            toggle();
            onEditCompleted(idBookingselected[0]);
            setSelected({});
          }}
        >
          OK
        </Button>
      </ModalFooter>
    </>
  );
};

ConfirmBookingsToClose.propTypes = {
  toggle: PropTypes.func.isRequired
};

export default ConfirmBookingsToClose;