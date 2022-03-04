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
        <p className="text-center">Do you want to close {idBookingselected.length} selected bookings with reason:</p>
        <h5 className="text-center font-weight-bold">{closedReason}</h5>
      </ModalBody>
      <ModalFooter>
        <Button
          className="float-right text-align-center ml-1"
          color="light"
          onClick={toggle}
        >
          Cancel
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
  toggle: PropTypes.func.isRequired,
  closedReason: PropTypes.string.isRequired,
  idBookingselected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onEditCompleted: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired
};

export default ConfirmBookingsToClose;
