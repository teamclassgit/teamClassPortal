// @packages
import { Briefcase, Mail, Phone, Plus, User } from "react-feather";
import { Alert, Button, CustomInput, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Cleave from "cleave.js/react";
import CleavePhone from "cleave.js/dist/addons/cleave-phone.us";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { v4 as uuid } from "uuid";
import validator from "validator";

// @scripts
import mutationInsertDistributor from "@graphql/MutationInsertDistributor";
import mutationUpdateDistributor from "@graphql/MutationUpdateDistributor";

// @styles
import "@molecules/instructor-modal/instructor-modal.scss";

const DistributorsModal = ({open, handleModal, isModeEdit, setIsModeEdit, data}) => {

  const [distributor, setDistributor] = useState({
    name: "",
    email: "",
    phone: "",
    company:"",
    IndividualEmailToCC: "",
    specialFeatures: {
      invoicing: false
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [createOneDistributor] = useMutation(mutationInsertDistributor);
  const [updateOneDistributor] = useMutation(mutationUpdateDistributor);
  const [isMutationError, setIsMutarionError] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState({
    email: true,
    IndividualEmailToCC: true
  });
  const [emailListToCC, setEmailListToCC] = useState([]);

  useEffect(() => {
    if (data, isModeEdit) {
      if (!data?.specialFeatures?.invoicing) {
        setDistributor({...data, specialFeatures: {invoicing: false}});
      } else {
        setDistributor(data);
      }
    }
    if (data?.emailCCList) {
      setEmailListToCC(data.emailCCList.split(";"));
    } else {
      setEmailListToCC([]);
    }
  }, [data, isModeEdit]);

  const validationEmail = (value, field) => setIsEmailValid({...isEmailValid, [field]: !value ? true : validator.isEmail(value)});

  const updateDistributor = async () => {
    try {
      setIsProcessing(true);

      const dataToUpdate = {
        name: distributor.name.charAt(0).toUpperCase() + distributor.name.slice(1),
        email: distributor.email?.toLowerCase().trim(),
        phone: distributor.phone,
        company: distributor.company,
        updatedAt: new Date(),
        emailCCList: emailListToCC.join(";"),
        invoicing: distributor.specialFeatures.invoicing
      };

      await updateOneDistributor({
        variables: {
          id: distributor._id,
          ...dataToUpdate
        },
        optimisticResponse: {
          updateDistributor: {
            id: distributor._id,
            __typename: "distributor",
            ...dataToUpdate
          }
        }
      });
      handleModalClose();
    } catch (error) {
      setIsMutarionError(true);
      console.error("Something went wrong. Please try again.", error);
    }
    setIsProcessing(false);
  };

  const insertDistributor = async () => {
    try {
      setIsProcessing(true);
      const createDistributor = {
        id: uuid(),
        name: distributor.name.charAt(0).toUpperCase() + distributor.name.slice(1),
        email: distributor.email?.toLowerCase().trim(),
        phone: distributor.phone,
        company: distributor.company,
        updatedAt: new Date(),
        createdAt: new Date(),
        emailCCList: emailListToCC.join(";"),
        active: true,
        invoicing: distributor.specialFeatures.invoicing
      };

      await createOneDistributor({
        variables: {
          ...createDistributor
        },
        optimisticResponse: {
          createDistributor: {
            ...createDistributor
          }
        }
      });
      handleModalClose();
    } catch (error) {
      setIsMutarionError(true);
      console.error("Something went wrong. Please try again.", error);
    }
    setIsProcessing(false);
  };

  const handleChange = (data, field) => {
    if (field === "invoicing") {
      setDistributor({...distributor, specialFeatures: {[field]: data}});
    } else {
      setDistributor({...distributor, [field]: data});
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isModeEdit) {
      updateDistributor();
    } else {
      insertDistributor();
    }
  };

  const handleModalClose = () => {
    setIsModeEdit(false);
    handleModal();
  };

  const handleAddition = () => {
    setEmailListToCC([...emailListToCC, distributor.IndividualEmailToCC]);
    distributor.IndividualEmailToCC = "";
  };

  const handleDelete = (i) => setEmailListToCC(emailListToCC.filter((_, index) => index !== i));

  return (
    <Modal
      className="sidebar-sm" 
      contentClassName="pt-0"
      isOpen={open}
      modalClassName="modal-slide-in"
    >
      <ModalHeader toggle={handleModalClose}>
        {`${isModeEdit ? "Update" : "New"} Distributor`}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody className="flex-grow-1 mt-2">
          <FormGroup>
            <Label for="full-name">Distributor Information</Label>
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
                value={distributor.name}
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
                required={true}
                invalid={!isEmailValid.email}
                value={distributor.email}
                onChange={(e) => handleChange(e.target.value, "email")}
                onBlur={(e) => validationEmail(e.target.value, "email")}
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
              value={distributor.phone}
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
              <Input
                id="company"
                placeholder="Company"
                value={distributor.company}
                onChange={(e) => handleChange(e.target.value, "company")}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="IndividualEmailToCC">Email list to CC</Label>
            <InputGroup size="sm">
              <Input
                type="email"
                name="IndividualEmailToCC"
                id="IndividualEmailToCC"
                placeholder="john@gmail.com"
                invalid={!isEmailValid.IndividualEmailToCC}
                value={distributor.IndividualEmailToCC}
                onChange={(e) => handleChange(e.target.value, "IndividualEmailToCC")}
                onBlur={(e) => validationEmail(e.target.value, "IndividualEmailToCC")}
                autoComplete="off"
              />
              <Button
                size="sm"
                onClick={handleAddition}
                disabled={!distributor.IndividualEmailToCC || !isEmailValid.IndividualEmailToCC}
              >
                <Plus size={16}/>
              </Button>
            </InputGroup>
            <small className="form-text text-muted">
              List of emails to cc when sending notifications and reminders
            </small>
            <div className="my-2">
              {emailListToCC && emailListToCC.map((tag, index) => (
                <span className='tags mb-1' key={index}>
                  { tag }
                  <a href="#" className='pl-1' onClick={() => handleDelete(index)}>x</a>
                </span>
              ))}
            </div>
          </FormGroup>
          <FormGroup>
            <Label>Special feature invoicing</Label>
            <CustomInput
              id="invoicing"
              type="switch"
              checked={distributor?.specialFeatures?.invoicing}
              onChange={(e) => handleChange(e.target.checked, "invoicing")}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter className="justify-content-center border-top-0">
          {isMutationError && (
            <Alert className="text-sm-left" color="secondary">
              Something went wrong. Please try again.
            </Alert>
          )}
          <Button color="secondary" size="sm" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm"
            type="submit"
            disabled={isProcessing || !distributor.name ||
              !distributor.email || !isEmailValid.email
            }
          >
            {isProcessing ? "Saving..." : isModeEdit ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default DistributorsModal;
