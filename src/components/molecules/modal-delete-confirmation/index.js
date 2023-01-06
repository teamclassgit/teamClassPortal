// @packages
import { Alert, Button, Modal, ModalFooter, ModalHeader } from "reactstrap";
import PropTypes from "prop-types";

const ModalDeleteConfirmation = ({
  isOpenModalDelete,
  toggleModalDelete,
  handleDeleteItem,
  itemName,
  isDeletingGetError,
  titleClasses,
  isMutationError,
  proccesing,
  hasBookingsAssigned
}) => (
  <Modal
    isOpen={isOpenModalDelete}
    className="mt-6"
    centered
  >
    <ModalHeader
      className="text-center"
      toggle={toggleModalDelete}
    >
      {`Delete ${itemName}?`}
    </ModalHeader>
    <ModalFooter className="justify-content-center">
      <Button
        color="secondary"
        onClick={toggleModalDelete}
      >
        Cancel
      </Button>
      <Button
        color="primary"
        onClick={handleDeleteItem}
      >
        {proccesing ? "Deleting..." : "Delete"}
      </Button>
      {isMutationError && (
        <Alert className="text-sm-left p-1" color="danger">
          Something went wrong. Please try again.
        </Alert>
      )}
      {isDeletingGetError && (
        <Alert className="text-sm-left p-1" color="danger">
          {
            itemName === "Coordinator" || !titleClasses.length ?
              `${itemName} is currently assigned to one or more bookings.` :
              `${itemName} is currently assigned to ${titleClasses.join(", ")} ${titleClasses.length > 1 ? " classes" : " class"}
              ${hasBookingsAssigned ? " and assigned to one or more bookings." : ""}`
          }
        </Alert>
      )}
    </ModalFooter>
  </Modal>
);

export default ModalDeleteConfirmation;

ModalDeleteConfirmation.propTypes = {
  itemName: PropTypes.oneOf(["Instructor", "Coordinator", "Distributor"])
};

ModalDeleteConfirmation.defaultProps = {
  itemName: "Instructor"
};
