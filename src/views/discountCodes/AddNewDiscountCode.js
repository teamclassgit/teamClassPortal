// @packages
import 'cleave.js/dist/addons/cleave-phone.us';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { Key, Percent, X, Tag, MessageCircle, DollarSign } from 'react-feather';
import { selectThemeColors } from '@utils';
import { useMutation } from '@apollo/client';
import { v4 as uuid } from 'uuid';
import {
  Alert,
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';

// @scripts
import mutationCreateDiscountCode from '../../graphql/MutationCreateDiscountCode';
import allTypes from '../../components/AllTypes.json';

// @styles
import '@styles/react/libs/flatpickr/flatpickr.scss';

const AddNewDiscountCode = ({ 
  baseElement,
  customers,
  discountCodesInformation,
  handleModal,
  open,
  setDiscountCodesInformation
}) => {
  const [bookingSignUpDeadline, setBookingSignUpDeadline] = useState([]);
  const [createDiscountCode] = useMutation(mutationCreateDiscountCode, {});
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newMaxDiscount, setNewMaxDiscount] = useState(null);
  const [newRedemption, setNewRedemption] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [type, setType] = useState('Percentage');
  const [warning, setWarning] = useState({ open: false, message: '' });
  
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
          customerId: selectedCustomer,
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

      setDiscountCodesInformation([
        resultCreateDiscountCode.data.insertOneDiscountCode,
        ...discountCodesInformation.filter((element) => element._id !== resultCreateDiscountCode.data.insertOneDiscountCode._id)
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

  const handleDifferentType = () => {
    if (type === 'Amount' && (newDiscount < 1 || newDiscount > 100)) {
      setWarning({ open: true, message: 'Discount must be greater than 0 and less than 100' });
    } else if (type === 'Percentage' && (newDiscount < 0 || newDiscount > 1)) {
      setWarning({ open: true, message: 'Discount must be greater than 0 and less than 1' });
    } else {
      setWarning({ open: false, message: '' });
    }
  };

  const sameCodeFilter = discountCodesInformation.map((discountCode) => {
    if (discountCode.discountCode === newCode) {
      return discountCode.discountCode;
    }
    return null;
  });

  const sameCode = sameCodeFilter.filter((item) => item !== null);

  const handleDifferentCode = () => {
    if (newCode.length > 0) {
      setNewCode(newCode.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, ''));
    }
    if (String(sameCode).length > 0) {
      setWarning({ open: true, message: 'Discount Code already exists' });
    } else if (newCode === '') {
      setWarning({ open: true, message: 'Please enter Discount Code' });
    } else {
      setWarning({ open: false, message: '' });
    }
  };

  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  useEffect(() => {
    if (baseElement) {
      setSelectedCustomer(baseElement.customerId);
      setNewCode(baseElement.code);
      setNewDescription(baseElement.description);
      setNewRedemption(baseElement.redemption);
      setNewDiscount(baseElement.discount);
      setNewMaxDiscount(baseElement.maxDiscount);
      setBookingSignUpDeadline(baseElement.expirationDate);
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
            <Label for="selectedCustomer">Select Customer</Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              placeholder="Customer Name/Email "
              options={
                customers &&
                customers.map((element) => {
                  return {
                    value: element._id,
                    label: `${element.name.split(' ')[0]} <${element.email}>`
                  };
                })
              }
              onChange={(option) => setSelectedCustomer(option.value)}
              isClearable={false}
              styles={selectStyles}
            />
          </FormGroup>
          <FormGroup>
            <Label for="discount-code">Discount Code Information*</Label>
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
                onFocus={() => handleDifferentCode()}
                onBlur={() => handleDifferentCode()}
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
                type="textarea"
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
            <InputGroup size="sm">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  {type === 'Amount' ? (
                    <DollarSign size={15} />
                  ) : (
                    <Percent size={15} />
                  )} 
                </InputGroupText>
              </InputGroupAddon>
              <Input 
                id="discount" 
                placeholder="Discount *" 
                value={newDiscount} 
                onChange={(e) => setNewDiscount(e.target.value)}
                onFocus={() => handleDifferentType()}
                onBlur={() => handleDifferentType()}
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
            <Label for="date-time-picker">Expiration Date (Code)*</Label>
            <InputGroup size="sm">
              <Flatpickr
                options={{
                  disable: [
                    function (date) {
                      return date < new Date();
                    }
                  ]
                }}
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
              String(sameCode).length > 0 ||
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

AddNewDiscountCode.propTypes = {
  baseElement: PropTypes.object.isRequired,
  customers: PropTypes.array.isRequired,
  discountCodesInformation: PropTypes.array.isRequired,
  handleModal: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setDiscountCodesInformation: PropTypes.func.isRequired
};
