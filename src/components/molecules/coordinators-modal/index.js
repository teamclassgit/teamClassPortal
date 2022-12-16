// @packages
import { Briefcase, Mail, Phone, Plus, User } from "react-feather";
import { Alert, Button, CustomInput, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Cleave from "cleave.js/react";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { v4 as uuid } from "uuid";
import validator from "validator";

// @scripts
import mutationInsertInstructor from "@graphql/MutationInsertInstructor";
import mutationUpdateInstructor from "@graphql/MutationUpdateInstructor";

const CoordinatorsModal = ({open, handleModal, isModeEdit, setIsModeEdit, data}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // if (isModeEdit) {
    //   updateInstructor();
    // } else {
    //   insertInstructor();
    // }
  };

  const handleModalClose = () => {
    setIsModeEdit(false);
    handleModal();
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
                required={true}
                // value={coordinator && coordinator.name}
                // onChange={(e) => handleChange(e.target.value, "name")}
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
                required={true}
                // invalid={!isEmailValid.email}
                // value={coordinator && coordinator.email}
                // onChange={(e) => handleChange(e.target.value, "email")}
                // onBlur={(e) => validationEmail(e.target.value, "email")}
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
                // value={coordinator && coordinator.phone}
                // onChange={(e) => handleChange(e.target.value, "phone")}
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
              <Input
                id="twilioPhone"
                placeholder="Twilio phone"
                // value={coordinator && coordinator.company}
                // onChange={(e) => handleChange(e.target.value, "company")}
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
              <Input
                id="calendlyLink"
                placeholder="Calendly link"
                // value={coordinator && coordinator.company}
                // onChange={(e) => handleChange(e.target.value, "company")}
              />
            </InputGroup>
          </FormGroup>
        </ModalBody>
        <ModalFooter className="justify-content-center border-top-0">
          {/* {isMutationError && (
            <Alert className="text-sm-left" color="secondary">
              Something went wrong. Please try again.
            </Alert>
          )} */}
          <Button color="secondary" size="sm" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm"
            type="submit"
            // disabled={isProcessing || !coordinator.name ||
            //   !coordinator.email || !isEmailValid.email
            // }
          >
            {isProcessing ? "Saving..." : isModeEdit ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default CoordinatorsModal;
