// @packages
import 'cleave.js/dist/addons/cleave-phone.us';
import React, { useEffect, useState } from 'react';
import { Key, Percent, X, Tag, MessageCircle, DollarSign, User } from 'react-feather';
import { useMutation } from '@apollo/client';
import Select from 'react-select';
import { selectThemeColors } from '@utils';
import { v4 as uuid } from 'uuid';
import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Alert
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';

// @scripts
import mutationCreateDiscountCode from '../../graphql/MutationCreateDiscountCode';

// @styles
import '@styles/react/libs/flatpickr/flatpickr.scss';

const AddNewDiscountCode = ({ 
  baseElement,
  bookings,
  customers,
  handleModal,
  open,
  setBookings,
  setCustomers
}) => {
  const [createDiscountCode] = useMutation(mutationCreateDiscountCode, {});
  const [newDiscount, setNewDiscount] = useState('');
  const [newMaxDiscount, setNewMaxDiscount] = useState(null);
  const [bookingSignUpDeadline, setBookingSignUpDeadline] = useState([]);
  const [newDescription, setNewDescription] = useState('');
  const [type, setType] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCustomerId, setNewCustomerId] = useState(null);
  const [newRedemption, setNewRedemption] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [warning, setWarning] = useState({ open: false, message: '' });

  const allTypes = [
    {
      label: 'Percentage'
    },
    {
      label: 'Amount'
    }
  ];
  
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


  const saveNewBooking = async () => {
    setProcessing(true);
    try {
      const resultCreateDiscountCode = await createDiscountCode({
        variables: {
          id: uuid(),
          discountCode: newCode.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, ''),
          description: newDescription,
          expirationDate: bookingSignUpDeadline && bookingSignUpDeadline.length > 0 ? bookingSignUpDeadline[0] : undefined,
          customerId: newCustomerId,
          redemptions: newRedemption,
          createdAt: new Date(),
          updatedAt: new Date(),
          type,
          discount: newDiscount,
          maxDiscount: newMaxDiscount ? newMaxDiscount : 0.0,
          active: true
        }
      });

      if (!resultCreateDiscountCode || !resultCreateDiscountCode.data) {
        setProcessing(false);
        return;
      }

      setBookings([
        resultCreateDiscountCode.data.insertOneDiscountCode,
        ...bookings.filter((element) => element._id !== resultCreateDiscountCode.data.insertOneDiscountCode._id)
      ]);
      setProcessing(false);
    } catch (ex) {
      console.log(ex);
      setProcessing(false);
    }
    handleModal();
  };

  const cancel = () => {
    handleModal();
  };

  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  useEffect(() => {
    if (baseElement) {
      setNewCustomerId(baseElement.customerId);
      setNewCode(baseElement.code);
      setNewDescription(baseElement.description);
      setNewRedemption(baseElement.redemption);
      setNewDiscount(baseElement.discount);
      setNewMaxDiscount(baseElement.maxDiscount);
      setBookingSignUpDeadline(baseElement.expirationDate);
      setType(baseElement.type);
      setWarning({ open: false, message: '' });
    }
  }, [baseElement]);

  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">{'New Discount Code'}</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <div className="demo-inline-spacing ">
          <FormGroup check inline>
            <Label check>
              New Discount Code
            </Label>
          </FormGroup>
        </div>
        <div>
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
                  if (newDescription === '') {
                    setWarning({ open: true, message: 'Please enter description' });
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
                onChange={(selectedDates, dateStr, instance) => {
                  setBookingSignUpDeadline(selectedDates);
                }}
              />
            </InputGroup>
            {bookingSignUpDeadline && (
              <dt className="text-right">
                <small>
                  <a href="#" onClick={(e) => setBookingSignUpDeadline([])}>
                    clear
                  </a>
                </small>
              </dt>
            )}
          </FormGroup>
        </div>
        <div align="center">
          <Button
            className="mr-1"
            color="primary"
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
            size="sm"
            onClick={saveNewBooking}
          >
            {processing ? 'Saving...' : 'Save'}
          </Button>
          <Button color="secondary" onClick={cancel} outline size="sm">
            Cancel
          </Button>
        </div>
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

export default AddNewDiscountCode;
