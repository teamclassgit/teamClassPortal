// @packages
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import { Calendar, Info, Mail, Phone, User } from "react-feather";
import { useMutation } from "@apollo/client";
import MutationUpdateOneQuestion from "../graphql/MutationUpdateOneQuestion";
import Select from "react-select";
import { selectThemeColors } from "@utils";

const EditGeneralInqueries = ({ open, currentElement, closeModal, allCoordinators }) => {
  const [active, setActive] = useState("1");
  const [isCatchError, setIsCatchError] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [coordinatorId, setCoordinatorId] = useState(null);
  const [coordinatorName, setCoordinatorName] = useState(null);

  const [updateOneQuestion] = useMutation(MutationUpdateOneQuestion, {});

  const toggle = (numberTab) => {
    if (active !== numberTab) {
      setActive(numberTab);
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 30,
      fontSize: 12
    }),
    option: (provided) => ({
      ...provided,
      borderBottom: "1px dotted",
      padding: 10,
      fontSize: 12
    }),
    singleValue: (provided) => ({
      ...provided,
      padding: 0,
      paddingBottom: 7,
      fontSize: 12
    })
  };

  useEffect(() => {
    if (!currentElement?._id) return;
    const coordinator = allCoordinators.find(element => {
      return (element._id === currentElement.eventCoordinatorId);
    });

    setCoordinatorName(coordinator?.name);
  }, [currentElement]);

  const handleSubmit = async (e) => {
    try {
      setProcessing(true);
      e.preventDefault();
      await updateOneQuestion({
        variables: {
          id: currentElement._id,
          eventCoordinatorId: coordinatorId
        }
      });
      setProcessing(false);
    } catch {
      setProcessing(false);
      setIsCatchError(true);
    }
  };

  return (
    <Modal isOpen={open} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader>
        <h5 className="modal-title">Edit Event Coodinator</h5>
      </ModalHeader>
      <Nav tabs className="d-flex justify-content-around mt-1">
        <NavItem>
          <NavLink
            title="Basic information"
            active={active === "1"}
            onClick={() => {
              toggle("1");
            }}
          >
            <Info size="18" />
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active} color="primary">
        <TabPane tabId="1">
          <ModalBody className="flex-grow-1">
            <Form onSubmit={(e) => {
              setIsCatchError(false);
              handleSubmit(e);
            }}>
              <FormGroup>
                <Label for="full-name">
                  <strong>Id:</strong> <span className="text-primary">{`${currentElement?._id}`}</span>
                </Label>
              </FormGroup>
              <FormGroup>
                <Label for="full-name">Question Information</Label>
                <InputGroup size="sm">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <User size={15} />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="full-name"
                    placeholder="Full Name *"
                    value={currentElement?.name}
                    disabled
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="sm">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Mail size={15} />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="email"
                    id="email"
                    disabled
                    placeholder="Email *"
                    value={currentElement?.email}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="sm">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Phone size={15} />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="form-control"
                    placeholder="Phone *"
                    id="phone"
                    disabled
                    value={currentElement.phone}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="sm">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Calendar size={15} />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="createdat"
                    id="createdat"
                    disabled
                    placeholder="Create date *"
                    value={currentElement?.date}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="selectCoordinator">Event Coordinator*</Label>
                <Select
                  theme={selectThemeColors}
                  styles={selectStyles}
                  name="selectCoordinator"
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select..."
                  value={{
                    label: coordinatorName,
                    value: coordinatorId
                  }}
                  options={
                    allCoordinators &&
                    allCoordinators.map((item) => {
                      return {
                        value: item._id,
                        label: item.name
                      };
                    })
                  }
                  onChange={(option) => {
                    setCoordinatorId(option.value);
                    setCoordinatorName(option.label);
                  }}
                  isClearable={false}
                />
              </FormGroup>
              <FormGroup>
                <Label>Inquiry</Label>
                <Input
                  type="textarea"
                  className="form-control"
                  id="inquery"
                  value={currentElement?.inquiry}
                  rows="15"
                  disabled
                />
              </FormGroup>

              <div align="center">
                <Button
                  className="mr-1"
                  size="sm"
                  color="primary"
                  disabled={!coordinatorName}
                >
                  {processing ? "Saving" : "Save"}
                </Button>
                <Button color="secondary" size="sm" onClick={closeModal} outline>
                  Cancel
                </Button>
              </div>
            </Form>
            {isCatchError && (
              <Alert color="danger" className="mt-3">
                <div className="alert-body">
                  Something went wrong. Please try again.
                </div>
              </Alert>
            )}
          </ModalBody>
        </TabPane>
      </TabContent>
    </Modal>
  );
};

EditGeneralInqueries.propTypes = {
  open: PropTypes.bool.isRequired,
  currentElement:PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  allCoordinators: PropTypes.array.isRequired
};

export default EditGeneralInqueries;
