// @packages
import Flatpickr from "react-flatpickr";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { 
  Button,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row 
} from "reactstrap";
import { Mail, Phone, User, X } from "react-feather";
import { useMutation } from "@apollo/client";

// @scripts
import {
  BOOKING_DEPOSIT_CONFIRMATION_STATUS,
  BOOKING_PAID_STATUS,
  CHARGE_OUTSIDE_SYSTEM,
  PAYMENT_STATUS_SUCCEEDED
} from "../../../utility/Constants";
import mutationUpdateBookingPayments from "../../../graphql/MutationUpdateBookingPayments";
import paymentMethodOptions from "./PaymentMethodOptions.json";
import { capitalizeString, isValidEmail } from "../../../utility/Utils";
import { selectThemeColors } from "@utils";

const AddPaymentModal = ({ 
  booking,
  currentPayment,
  handleModal, 
  mode,
  open,
  payments,
  setBooking,
  setCurrentPayment,
  setPayments
}) => {
  const [emailValid, setEmailValid] = useState(true);
  const [newAmount, setNewAmount] = useState(null);
  const [newCardBrand, setNewCardBrand] = useState(null);
  const [newCardLastFourDigits, setNewCardLastFourDigits] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newName, setNewName] = useState(null);
  const [newPaymentCreationDate, setNewPaymentCreationDate] = useState([]);
  const [newPaymentId, setNewPaymentId] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState(null);
  const [newPaymentName, setNewPaymentName] = useState(null);
  const [newPhone, setNewPhone] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [updateBookingPayment] = useMutation(mutationUpdateBookingPayments, {});

  const paymentNameOptions = [
    {
      label: "Deposit",
      value: "deposit"
    }
  ];

  if (booking && (!booking.payments || !booking.payments.find((element) => element.paymentName === "final" && element.status === "succeeded"))) {
    paymentNameOptions.push({
      label: "Final",
      value: "final"
    });
  }

  const emailValidation = (email) => {
    setEmailValid(isValidEmail(email));
  };

  useEffect(() => {
    if (currentPayment) {
      setNewAmount(currentPayment.amount / 100);
      setNewCardBrand(currentPayment.cardBrand);
      setNewCardLastFourDigits(currentPayment.cardLast4);
      setNewEmail(currentPayment.email);
      setNewName(currentPayment.name);
      setNewPaymentCreationDate([currentPayment.createdAt]);
      setNewPaymentId(currentPayment.paymentId);
      setNewPaymentMethod(currentPayment.paymentMethod);
      setNewPaymentName(currentPayment.paymentName);
      setNewPhone(currentPayment.phone);
    } else {
      setNewAmount(0);
      setNewCardBrand("");
      setNewCardLastFourDigits("");
      setNewEmail("");
      setNewName("");
      setNewPaymentCreationDate([]);
      setNewPaymentId("");
      setNewPaymentMethod("");
      setNewPaymentName("");
      setNewPhone("");
    }
  }, [currentPayment]);

  useEffect(() => {
    if (newPaymentMethod !== "card") {
      setNewCardBrand("");
      setNewCardLastFourDigits("");
    }
  }, [newPaymentMethod]);

  const cancel = () => {
    setCurrentPayment(null);
    handleModal();
  };

  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  const updateBookingPaymentInfo = async () => {
    setProcessing(true);

    let newPaymentsArray = payments ? [...payments] : [];

    const newPayment = {
      name: newName,
      email: newEmail,
      phone: newPhone,
      amount: newAmount * 100,
      cardBrand: newCardBrand,
      cardLast4: newCardLastFourDigits,
      createdAt: newPaymentCreationDate && newPaymentCreationDate.length > 0 && newPaymentCreationDate[0],
      paymentName: newPaymentName,
      paymentMethod: newPaymentMethod,
      paymentId: newPaymentId,
      chargeUrl: CHARGE_OUTSIDE_SYSTEM,
      status: PAYMENT_STATUS_SUCCEEDED
    };

    if (mode === "edit") {
      newPaymentsArray = [
        ...newPaymentsArray.slice(0, currentPayment.index),
        ...newPaymentsArray.slice(currentPayment.index + 1, newPaymentsArray.lenght)
      ];
    }
    newPaymentsArray.push(newPayment);
    newPaymentsArray.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    const finalPayment = newPaymentsArray && newPaymentsArray.find((element) => element.paymentName === "final" && element.status === "succeeded");
    const depositPayment =
      newPaymentsArray && newPaymentsArray.find((element) => element.paymentName === "deposit" && element.status === "succeeded");

    const newBookingStatus = finalPayment ? BOOKING_PAID_STATUS : depositPayment ? BOOKING_DEPOSIT_CONFIRMATION_STATUS : booking.status;

    try {
      const result = await updateBookingPayment({
        variables: {
          bookingId: booking._id,
          updatedAt: new Date(),
          payments: newPaymentsArray,
          status: newBookingStatus
        }
      });
      if (result && result.data && result.data.updateOneBooking) {
        setPayments(newPaymentsArray);
        setBooking(result.data.updateOneBooking);
      }
    } catch (error) {
      console.log("Error saving payments", error);
    }
    setProcessing(false);
    handleModal();
  };

  return (
    <Modal 
      className="sidebar-sm" 
      contentClassName="pt-0"
      isOpen={open} 
      modalClassName="modal-slide-in" 
    >
      <ModalHeader className="mb-3" toggle={handleModal} close={CloseBtn} tag="div">
        {mode === "edit" ? <h5 className="modal-title">Edit Payment</h5> : <h5 className="modal-title">New Payment</h5>}
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <User size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id="name" placeholder="Full Name*" required={true} value={newName} onChange={(e) => setNewName(e.target.value)} />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Mail size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              id="email"
              placeholder="Email*"
              required={true}
              invalid={!emailValid}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onBlur={(e) => {
                emailValidation(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Phone size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id="phone" placeholder="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
          </InputGroup>
        </FormGroup>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="amount">Amount*</Label>
              <Input
                id="amount"
                type="number"
                invalid={newAmount && newAmount <= 0}
                min="1"
                step="any"
                placeholder=""
                prefix="$"
                required={true}
                value={newAmount ? newAmount : ""}
                onChange={(e) => setNewAmount(e.target.value)}
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="created">Created At*</Label>
              <InputGroup>
                <Flatpickr
                  className="small"
                  value={newPaymentCreationDate}
                  options={{
                    disable: [
                      function (date) {
                        // return true to disable
                        return date > new Date();
                      }
                    ]
                  }}
                  dateformat="Y-m-d H:i"
                  data-enable-time
                  id="signUpDateLine"
                  className="form-control"
                  placeholder="Select Date..."
                  onChange={(selectedDates, dateStr, instance) => {
                    setNewPaymentCreationDate(selectedDates);
                  }}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="payment-name">Payment Name*</Label>
              <Select
                value={{
                  value: newPaymentName || "",
                  label: capitalizeString(newPaymentName)
                }}
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                placeholder=""
                options={paymentNameOptions.map((item) => {
                  return {
                    label: item.label,
                    value: item.value
                  };
                })}
                onChange={(option) => setNewPaymentName(option.value)}
                isClearable={false}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="payment-method">Payment Method*</Label>
              <Select
                value={{
                  value: newPaymentMethod || "",
                  label: capitalizeString(newPaymentMethod)
                }}
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                placeholder=""
                options={paymentMethodOptions.map((item) => {
                  return {
                    label: item.label,
                    value: item.value
                  };
                })}
                onChange={(option) => setNewPaymentMethod(option.value)}
                isClearable={false}
              />
            </FormGroup>
          </Col>
        </Row>
        {newPaymentMethod === "card" && (
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="card-last-4">Card Last 4 Digits*</Label>
                <Input
                  id="card-last-4"
                  placeholder="4545"
                  required={true}
                  value={newCardLastFourDigits}
                  onChange={(e) => setNewCardLastFourDigits(e.target.value)}
                  maxLength="4"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="card-brand">Card Brand*</Label>
                <Input
                  id="card-brand"
                  type="text"
                  placeholder="Visa"
                  required={true}
                  value={newCardBrand}
                  onChange={(e) => setNewCardBrand(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        )}
        <FormGroup>
          <Label for="payment-id">Payment ID</Label>
          <Input id="payment-id" placeholder="" value={newPaymentId} onChange={(e) => setNewPaymentId(e.target.value)} />
          <small>ID of the payment platform.</small>
        </FormGroup>

        <Button
          className="mr-1 mt-1"
          color="primary"
          onClick={updateBookingPaymentInfo}
          disabled={
            !newName ||
            !emailValid ||
            !newEmail ||
            !newAmount ||
            newAmount <= 0 ||
            !newPaymentCreationDate ||
            !newPaymentName ||
            !newPaymentMethod ||
            (newPaymentMethod === "card" && !newCardBrand) ||
            (newPaymentMethod === "card" && !newCardLastFourDigits)
          }
        >
          {processing ? "Saving..." : "Save"}
        </Button>
        <Button className="mt-1" color="secondary" onClick={cancel} outline>
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default AddPaymentModal;
