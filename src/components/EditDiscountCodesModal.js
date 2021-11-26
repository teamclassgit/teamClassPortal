// @packages
import Flatpickr from 'react-flatpickr';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { User, X, Key, Percent, Tag, MessageCircle, DollarSign } from 'react-feather';
import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Alert,
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap';
import { selectThemeColors } from '@utils';
import { useMutation } from '@apollo/client';

// @scripts
import mutationEditDiscountCode from '../graphql/MutationEditDiscountCode';

// @styles
import './EditBookingModal.scss';

const EditDiscountCodesModal = ({
  currentElement: {
    currentCode,
    currentCodeId,
    currentCustomerId,
    currentDescription,
    currentDiscount,
    currentCreatedAt,
    currentExpirationDate,
    currentMaxDiscount,
    currentRedemption,
    currentType
  },
  open,
  handleModal,
  bookings,
  setBookings,
  editMode,
  handleClose
}) => {
  const [bookingSignUpDeadline, setBookingSignUpDeadline] = useState([]);
  const [closedBookingReason, setClosedBookingReason] = useState(null);
  const [newCode, setNewCode] = useState(null);
  const [newCustomerId, setNewCustomerId] = useState(null);
  const [newDescription, setNewDescription] = useState(null);
  const [newDiscount, setNewDiscount] = useState(null);
  const [newMaxDiscount, setNewMaxDiscount] = useState(null);
  const [newRedemption, setNewRedemption] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [type, setType] = useState('Percentage');
  const [warning, setWarning] = useState({ open: false, message: '' });

  const [editDiscountCode] = useMutation(mutationEditDiscountCode, {});

  useEffect(() => {
    setNewCustomerId(currentCustomerId);
    setNewCode(currentCode);
    setNewDescription(currentDescription);
    setNewRedemption(currentRedemption);
    setNewDiscount(currentDiscount);
    setNewMaxDiscount(currentMaxDiscount);
    setBookingSignUpDeadline(currentExpirationDate);
    setType(currentType);
  }, [currentCodeId]);

  const allTypes = [
    {
      label: 'Percentage'
    },
    {
      label: 'Amount'
    }
  ];

  const cancel = () => {
    handleModal();
  };

  const editBooking = async () => {
    setProcessing(true);
    try {
      const resultEditDiscountCode = await editDiscountCode({
        variables: {
          id: currentCodeId,
          discountCode: newCode.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, ''),
          description: newDescription,
          expirationDate: bookingSignUpDeadline && bookingSignUpDeadline.length > 0 ? bookingSignUpDeadline : undefined,
          customerId: newCustomerId,
          redemptions: newRedemption,
          createdAt: currentCreatedAt,
          updatedAt: new Date(),
          type,
          discount: newDiscount,
          maxDiscount: newMaxDiscount ? newMaxDiscount : 0.0,
          active: true
        }
      });
        
      if (!resultEditDiscountCode || !resultEditDiscountCode.data) {
        setProcessing(false);
        return;
      }

      setBookings([
        resultEditDiscountCode.data.updateOneDiscountCode,
        ...bookings.filter((element) => element._id !== resultEditDiscountCode.data.updateOneDiscountCode._id)
      ]);

      setProcessing(false);
    } catch (ex) {
      console.log(ex);
      setProcessing(false);
      setClosedBookingReason(null);
    }
    handleModal();
  };

  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  const selectStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 30,
      fontSize: 12
    }),
    option: (provided) => ({
      ...provided,
      borderBottom: '1px dotted',
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

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className="sidebar-sm"
      modalClassName="modal-slide-in"
      contentClassName="pt-0"
      onClosed={(e) => handleClose()}
    >
      <ModalHeader toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">Edit Discount Code</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <FormGroup>
          <Label for="full-name">
            <strong>Id:</strong> <span className="text-primary">{`${currentCodeId}`}</span>
          </Label>
        </FormGroup>
        <FormGroup>
          <Label for="discount-code">Discount Code Information*</Label>
          <InputGroup size="sm">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <User size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              id="discount-code-customer-id"
              placeholder="Customer Id"
              type="text"
              value={newCustomerId}
              onChange={(e) => setNewCustomerId(e.target.value)}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup size="sm">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Tag size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input 
              id="discount-code" 
              placeholder="Discount Code *" 
              value={newCode} 
              onChange={(e) => setNewCode(e.target.value)}
              onBlur={() => {
                if (newCode === '') {
                  setWarning({ open: true, message: 'Please enter discount code' });
                } else {
                  setWarning({ open: false, message: '' });
                }
              }}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup size="sm">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <MessageCircle size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              id="discount-code-description"
              placeholder="Description *"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onBlur={() => {
                if (newCode === '') {
                  setWarning({ open: true, message: 'Please enter description code' });
                } else {
                  setWarning({ open: false, message: '' });
                }
              }}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup size="sm">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Key size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              className='form-control'
              id="dicount-code-redemptions"
              onChange={(e) => setNewRedemption(e.target.value)}
              placeholder="Redemptions *"
              value={newRedemption}
              type="number"
              onBlur={() => {
                if (newRedemption < 1) {
                  setWarning({ open: true, message: 'Redemptions must be greater than 0' });
                } else {
                  setWarning({ open: false, message: '' });
                }
              }}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup size="sm">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Percent size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input 
              id="discount" 
              placeholder="Discount *" 
              value={newDiscount} 
              onChange={(e) => setNewDiscount(e.target.value)}
              onFocus={() => {
                if (type === 'Amount' && (newDiscount < 1 || newDiscount > 100)) {
                  setWarning({ open: true, message: 'Discount must be greater than 0 and less than 100' });
                } else if (type === 'Percentage' && (newDiscount < 0 || newDiscount > 1)) {
                  setWarning({ open: true, message: 'Discount must be greater than 0 and less than 1' });
                } else {
                  setWarning({ open: false, message: '' });
                }
              }}
              onBlur={() => {
                if (type === 'Amount' && (newDiscount < 1 || newDiscount > 100)) {
                  setWarning({ open: true, message: 'Discount must be greater than 0 and less than 100' });
                } else if (type === 'Percentage' && (newDiscount < 0 || newDiscount > 1)) {
                  setWarning({ open: true, message: 'Discount must be greater than 0 and less than 1' });
                } else {
                  setWarning({ open: false, message: '' });
                }
              }}
            />
          </InputGroup>
        </FormGroup>
        {type === 'Percentage' && (
          <FormGroup>
            <InputGroup size="sm">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <DollarSign size={15} />
                </InputGroupText>
              </InputGroupAddon>
              <Input 
                id="maxDiscount" 
                placeholder="Max Discount *" 
                value={newMaxDiscount} 
                onChange={(e) => setNewMaxDiscount(e.target.value)} 
                type="number"
              />
            </InputGroup>
          </FormGroup>
        )}
        <FormGroup>
          <Label for="full-name">Type*</Label>
          <Select
            theme={selectThemeColors}
            styles={selectStyles}
            className="react-select"
            classNamePrefix="select"
            placeholder="Type..."
            value={{
              label: type
            }}
            options={
              allTypes &&
              allTypes.map((item) => {
                return {
                  label: item.label
                };
              })
            }
            onChange={(option) => {
              setType(option.label);
            }}
            isClearable={false}
          />
        </FormGroup>
        <FormGroup>
          <Label for="date-time-picker">Expiration Date (Code)*</Label>
          <InputGroup size="sm">
            <Flatpickr
              value={bookingSignUpDeadline}
              dateformat="Y-m-d H:i"
              data-enable-time
              id="discount-code-expiration-date"
              className="form-control"
              placeholder="Select Date..."
              onChange={(selectedDates) => {
                setBookingSignUpDeadline(selectedDates);
              }}
            />
          </InputGroup>
          {bookingSignUpDeadline && (
            <dt className="text-right">
              <small>
                <a href="#" onClick={() => setBookingSignUpDeadline([])}>
                  clear
                </a>
              </small>
            </dt>
          )}
        </FormGroup>
        {editMode && (
          <div align="center">
            <Button
              className="mr-1"
              size="sm"
              disabled={
                warning.open ||
                !newCode ||
                !type ||
                newDescription.length < 5 ||
                type === 'Amount' && (newDiscount < 1 || newDiscount > 100) ||
                type === 'Percentage' && (newDiscount < 0 || newDiscount > 1) ||
                !newDiscount  ||
                !newRedemption ||
                (type === "Percentage" && !newMaxDiscount) ||
                !(bookingSignUpDeadline && bookingSignUpDeadline.length > 0 ? bookingSignUpDeadline[0] : undefined)
              }
              color={closedBookingReason ? 'danger' : 'primary'}
              onClick={editBooking}
            >
              {!processing && !closedBookingReason
                ? 'Save'
                : closedBookingReason && processing
                  ? 'Saving...'
                  : processing
                    ? 'Saving...'
                    : 'Close booking?'}
            </Button>
            <Button color="secondary" size="sm" onClick={cancel} outline>
              Cancel
            </Button>
          </div>
        )}
        {warning.open && (
          <div>
            <br />
            <Alert color="warning" isOpen={warning.open}>
              <div className="alert-body">
                <span>{warning.message}</span>
              </div>
            </Alert>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default EditDiscountCodesModal;
