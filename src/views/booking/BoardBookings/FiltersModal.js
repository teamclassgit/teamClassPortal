// @packages
import Flatpickr from "react-flatpickr";
import PropTypes from "prop-types";
import React, { useState, useContext } from "react";
import Select from "react-select";
import { Modal, ModalHeader, ModalBody, FormGroup, Label, Button } from "reactstrap";
import closeBookingOptions from "@data/closed-booking-options.json";

// @scripts
import { FiltersContext } from "../../../context/FiltersContext/FiltersContext";

const FiltersModal = ({
  classes,
  coordinators,
  handleModal,
  isFilterByClass,
  isFilterByCoordinator,
  isFilterByCreationDate,
  isFilterByClosedReason,
  open
}) => {
  const { classFilterContext, setClassFilterContext } = useContext(FiltersContext);
  const { coordinatorFilterContext, setCoordinatorFilterContext } = useContext(FiltersContext);
  const { dateFilterContext, setDateFilterContext } = useContext(FiltersContext);
  const { closedReasonFilterContext, setClosedReasonFilterContext } = useContext(FiltersContext);

  const [filterByClass, setFilterByClass] = useState(classFilterContext);
  const [filterByCoordinator, setFilterByCoordinator] = useState(coordinatorFilterContext);
  const [filterByDate, setFilterByDate] = useState(dateFilterContext);
  const [filterByClosedReason, setFilterByClosedReason] = useState(closedReasonFilterContext);

  const classOptions = classes && classes.map(({ title, _id }) => ({ value: _id, label: title }));
  const getClassFilterDefaultValue = () => {
    if (classFilterContext) {
      return classOptions.find((opt) => opt.value === classFilterContext.value);
    }
    return [];
  };

  const coordinatorOptions = coordinators && coordinators.map(({ name, _id }) => ({ value: _id, label: name }));
  const getCoordinatorFilterDefaultValue = () => {
    if (coordinatorFilterContext) {
      const values = coordinatorFilterContext.value;
      return coordinatorOptions.filter((opt) => values && values.includes(opt.value));
    }
    return null;
  };

  const closedReasonOptions = closeBookingOptions.map((item) => {
    return {
      label: item.label,
      value: item.value
    };
  });
  const getClosedReasonFilterDefaultValue = () => {
    if (closedReasonFilterContext) {
      return closedReasonOptions.find((opt) => opt.value === closedReasonFilterContext.value);
    }
    return [];
  };

  const handleApplyFilters = () => {
    setClassFilterContext(filterByClass && filterByClass.value ? filterByClass : null);
    setCoordinatorFilterContext(
      filterByCoordinator && filterByCoordinator.value && filterByCoordinator.value.length > 0 ? filterByCoordinator : null
    );
    setDateFilterContext(filterByDate && filterByDate.value ? filterByDate : null);
    setClosedReasonFilterContext(filterByClosedReason && filterByClosedReason.value ? filterByClosedReason : null);
    handleModal();
  };

  const handleClearFilters = () => {
    setClassFilterContext(null);
    setCoordinatorFilterContext(null);
    setDateFilterContext(null);
    setClosedReasonFilterContext(null);
    handleModal();
  };

  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="" toggle={handleModal} tag="div">
        <h5 className="modal-title mt-1">Filter opportunities</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1 mt-2">
        <Button color="link" className="pl-0" onClick={() => handleApplyFilters()}>
          Apply filters
        </Button>
        <Button color="link" className="pl-0 float-right" onClick={() => handleClearFilters()}>
          Clear filters
        </Button>
        {isFilterByClass && (
          <FormGroup>
            <Label for="exampleSelect" className="text-dark mt-2">
              Filter by class
            </Label>
            <Select
              classNamePrefix="select"
              className="react-select"
              defaultValue={getClassFilterDefaultValue()}
              options={classOptions}
              onChange={(e) => {
                setFilterByClass({ type: "class", value: e.value, label: e.label });
              }}
            />
          </FormGroup>
        )}
        {isFilterByCoordinator && (
          <FormGroup>
            <Label for="exampleSelect" className="text-dark">
              Filter by event coordinator
            </Label>
            <Select
              defaultValue={getCoordinatorFilterDefaultValue()}
              options={coordinatorOptions}
              classNamePrefix="select"
              onChange={(e) => {
                setFilterByCoordinator({ type: "coordinator", value: e.map((element) => element.value), label: e.map((element) => element.label) });
              }}
              isMulti={true}
            />
          </FormGroup>
        )}
        {isFilterByCreationDate && (
          <FormGroup>
            <Label for="exampleSelect" className="text-dark">
              Filter by creation date
            </Label>
            <Flatpickr
              value={dateFilterContext && dateFilterContext.value}
              placeholder="Select Date Range..."
              id="range-picker"
              className="form-control"
              onChange={(dates) => setFilterByDate({
                type: "date",
                value: dates
              })
              }
              options={{
                mode: "range"
              }}
            />
          </FormGroup>
        )}
        {isFilterByClosedReason && (
          <FormGroup>
            <Label for="exampleSelect" className="text-dark">
              Filter by closed reason
            </Label>
            <Select
              classNamePrefix="select"
              className="react-select"
              defaultValue={getClosedReasonFilterDefaultValue()}
              options={closedReasonOptions}
              onChange={(e) => {
                setFilterByClosedReason({ type: "closedReason", value: e.value, label: e.label });
              }}
            />
          </FormGroup>
        )}
      </ModalBody>
    </Modal>
  );
};

export default FiltersModal;

FiltersModal.propTypes = {
  classes: PropTypes.array,
  coordinators: PropTypes.array,
  handleModal: PropTypes.func,
  isFilterByClass: PropTypes.bool,
  isFilterByCoordinator: PropTypes.bool,
  isFilterByCreationDate: PropTypes.bool,
  open: PropTypes.bool
};
