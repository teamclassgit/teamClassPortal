// @packages
import { Briefcase, Link, Mail, Phone, User } from "react-feather";
import { Alert, Button, CustomInput, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Cleave from "cleave.js/react";
import CleavePhone from "cleave.js/dist/addons/cleave-phone.us";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { v4 as uuid } from "uuid";
import validator from "validator";

// @scripts
import mutationInsertCoordinator from "@graphql/MutationInsertCoordinator";
import mutationUpdateCoordinator from "@graphql/MutationUpdateCoordinator";

const CoordinatorsModal = ({open, handleModal, isModeEdit, setIsModeEdit, data}) => {

  const [coordinator, setCoordinator] = useState({
    default: false,
    email: "",
    name: "",
    phone: "",
    twilioPhone: "",
    calendlyLink: ""
  });
  const [createOneEventCoordinator] = useMutation(mutationInsertCoordinator);
  const [updateEventCoordinator] = useMutation(mutationUpdateCoordinator);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMutationError, setIsMutarionError] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const emailValidation = value => setIsEmailValid(value !== "" ? validator.isEmail(value) : true);

  useEffect(() => {
    if (data) {
      setCoordinator(data);
    }
  }, [data]);

  const handleModalClose = () => {
    setIsModeEdit(false);
    handleModal();
  };

  const handleChange = (data, field) => {
    setCoordinator({...coordinator, [field]: data});
  };

  const insertCoordinator = async () => {
    try {
      setIsProcessing(true);

      const createCoordinator = {
        id: uuid(),
        default: coordinator.default,
        email: coordinator?.email?.toLowerCase().trim(),
        name: coordinator.name,
        phone: coordinator.phone,
        twilioPhone: coordinator.twilioPhone,
        calendlyLink: coordinator.calendlyLink
      };

      await createOneEventCoordinator({
        variables: {
          ...createCoordinator
        },
        optimisticResponse: {
          createEventCoordinator: {
            ...createCoordinator,
            __typename:"EventCoordinator"
          }
        }
      });
      handleModalClose();
    } catch (ex) {
      setIsMutarionError(true);
      console.log("Something went wrong. Please try again.", ex);
    }
    setIsProcessing(false);
  };

  const updateCoordinator = async () => {
    try {
      setIsProcessing(true);
      const dataToUpdate = {
        default: coordinator.default,
        email: coordinator?.email?.toLowerCase().trim(),
        name: coordinator.name,
        phone: coordinator.phone,
        twilioPhone: coordinator.twilioPhone,
        calendlyLink: coordinator.calendlyLink
      };

      await updateEventCoordinator({
        variables: {
          id: coordinator._id,
          ...dataToUpdate
        },
        optimisticResponse: {
          updateEventCoordinator: {
            id: coordinator._id,
            __typename: "EventCoordinator",
            ...dataToUpdate
          }
        }
      });
      handleModalClose();
    } catch (error) {
      setIsMutarionError(true);
      console.error("Something went wrong. Please try again.", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isModeEdit) {
      updateCoordinator();
    } else {
      insertCoordinator();
    }
  };

  return (
    <Modal
      className="sidebar-sm" 
      contentClassName="pt-0"
      isOpen={open}
      modalClassName="modal-slide-in"
    >
      <ModalHeader toggle={handleModalClose}>
        {`${isModeEdit ? "Update" : "New"} Coordinator`}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody className="flex-grow-1 mt-2">
          <FormGroup>
            <Label for="full-name">Coordinator Information</Label>
            <InputGroup size="sm">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <User size={15} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="name"
                placeholder="Full Name *"
                required
                value={coordinator.name}
                onChange={(e) => handleChange(e.target.value, "name")}
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
                placeholder="Email *"
                required
                invalid={!isEmailValid}
                value={coordinator.email}
                onChange={(e) => handleChange(e.target.value, "email")}
                onBlur={(e) => emailValidation(e.target.value, "email")}
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
              <Cleave
                className="form-control"
                placeholder="Phone"
                id="phone"
                options={{ phone: true, phoneRegionCode: "US"}}
                value={coordinator.phone}
                onChange={(e) => handleChange(e.target.value, "phone")}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup size="sm">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <Briefcase size={15} />
                </InputGroupText>
              </InputGroupAddon>
              <Cleave
                className="form-control"
                placeholder="Twilio phone"
                id="twilioPhone"
                options={{ phone: true }}
                value={coordinator.twilioPhone}
                onChange={(e) => handleChange(e.target.value, "twilioPhone")}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup size="sm">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <Link size={15} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="calendlyLink"
                placeholder="Calendly link"
                value={coordinator.calendlyLink}
                onChange={(e) => handleChange(e.target.value, "calendlyLink")}
                pattern="https?://.+"
              />
            </InputGroup>
            <small className="text-muted">
              Include https://
            </small>
          </FormGroup>
          <FormGroup>
            <Label>Default Coordinator?</Label>
            <InputGroup size="sm">
              <CustomInput
                id="default"
                type="switch"
                checked={coordinator.default}
                onChange={(e) => handleChange(e.target.checked, "default")}
              />
            </InputGroup>
          </FormGroup>
        </ModalBody>
        <ModalFooter className="justify-content-center border-top-0">
          <Button color="secondary" size="sm" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm"
            type="submit"
            disabled={isProcessing || !coordinator.name ||
              !coordinator.email || !isEmailValid
            }
          >
            {isProcessing ? "Saving..." : isModeEdit ? "Update" : "Create"}
          </Button>
          {isMutationError && (
            <Alert className="text-sm-left" color="danger">
              Something went wrong. Please try again.
            </Alert>
          )}
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default CoordinatorsModal;
