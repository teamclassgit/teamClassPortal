// @packages
import { Alert, Button, Modal, ModalFooter, ModalHeader } from "reactstrap";
import PropTypes from "prop-types";

const ModalDeleteConfirmation = ({
  isOpenModalDelete,
  toggleModalDelete,
  handleDeleteItem,
  itemName,
  isDeleteInstructorError,
  titleClasses,
  isMutationError,
  proccesing
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
      {isDeleteInstructorError && (
        <Alert className="text-sm-left p-1" color="danger">
          {`Instructor is currently assigned to ${titleClasses.join(", ")} ${titleClasses.length > 1 ? " classes" : " class"}.`}
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
