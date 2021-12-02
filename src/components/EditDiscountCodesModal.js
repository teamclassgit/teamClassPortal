// @packages
import Flatpickr from 'react-flatpickr';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { X, Key, Percent, Tag, MessageCircle, DollarSign } from 'react-feather';
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
import { selectThemeColors } from '@utils';
import { useMutation } from '@apollo/client';

// @scripts
import mutationEditDiscountCode from '../graphql/MutationEditDiscountCode';
import allTypes from './AllTypes.json';

const EditDiscountCodesModal = ({
  currentElement: {
    currentActive,
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
  customers,
  discountCodesInformation,
  editMode,
  handleClose,
  handleModal,
  open,
  setDiscountCodesInformation
}) => {
  const [discountCodesdDeadLine, setDiscountCodesDeadLine] = useState([]);
  const [editDiscountCode] = useMutation(mutationEditDiscountCode, {});
  const [newCode, setNewCode] = useState(null);
  const [newDescription, setNewDescription] = useState(null);
  const [newDiscount, setNewDiscount] = useState(null);
  const [newMaxDiscount, setNewMaxDiscount] = useState(null);
  const [newRedemption, setNewRedemption] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [type, setType] = useState('');
  const [warning, setWarning] = useState({ open: false, message: '' });
  const updatedDate = discountCodesdDeadLine && discountCodesdDeadLine?.length > 0 && discountCodesdDeadLine ? discountCodesdDeadLine[0] : undefined;

  useEffect(() => {
    setDiscountCodesDeadLine(currentExpirationDate);
    setNewCode(currentCode);
    setNewDescription(currentDescription);
    setNewDiscount(currentDiscount);
    setNewMaxDiscount(currentMaxDiscount);
    setNewRedemption(currentRedemption);
    setSelectedCustomer(currentCustomerId);
    setType(currentType);
  }, [currentCodeId]);

  const cancel = () => {
    handleModal();
  };

  const handleDifferentType = () => {
    if ((type === 'Amount' || type === 'Percentage') && (newDiscount < 0 || newDiscount > 100)) {
      setWarning({ open: true, message: 'Discount must be greater or equal than 0 and less than 100' });
    } else {
      setWarning({ open: false, message: '' });
    }
  };

  const sameCodeFilter = discountCodesInformation.map((discountCode) => {
    if (discountCode.discountCode === newCode && discountCode.discountCode !== currentCode) {
      return discountCode.discountCode;
    }
    return null;
  });

  const sameCode = sameCodeFilter.filter((item) => item !== null);

  const findCustomer = customers.find((customer) => customer._id === selectedCustomer);
  const findAllCustomerSelected = findCustomer ? `${findCustomer?.name?.split(' ')[0]} <${findCustomer?.email}>` : '';

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

  const editDiscountCodes = async () => {
    setProcessing(true);
    try {
      const resultEditDiscountCode = await editDiscountCode({
        variables: {
          id: currentCodeId,
          discountCode: newCode.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, ''),
          description: newDescription,
          expirationDate: updatedDate === '2' ? currentExpirationDate :  updatedDate,
          customerId: selectedCustomer,
          redemptions: newRedemption,
          createdAt: currentCreatedAt,
          updatedAt: new Date(),
          type,
          discount: newDiscount,
          maxDiscount: newMaxDiscount ? newMaxDiscount : 0.0,
          active: currentActive
        }
      });
        
      if (!resultEditDiscountCode || !resultEditDiscountCode.data) {
        setProcessing(false);
        return;
      }

      setDiscountCodesInformation([
        resultEditDiscountCode.data.updateOneDiscountCode,
        ...discountCodesInformation.filter((element) => element._id !== resultEditDiscountCode.data.updateOneDiscountCode._id)
      ]);

      setProcessing(false);
    } catch (ex) {
      console.log(ex);
      setProcessing(false);
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
      onClosed={() => handleClose()}
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
          <Label for="Type">Type*</Label>
          <Select
            defaultValue={{ label: currentType }}
            theme={selectThemeColors}
            className="react-select"
            classNamePrefix="select"
            placeholder="Type..."
            options={
              allTypes &&
              allTypes.map((element) => {
                return {
                  label: element.label,
                  value: element.value
                };
              })
            }
            onChange={(option) => setType(option.label)}
            isClearable={false}
            styles={selectStyles}
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
              value={discountCodesdDeadLine}
              dateformat="Y-m-d H:i"
              data-enable-time
              id="discount-code-expiration-date"
              className="form-control"
              placeholder="Select Date..."
              onChange={(selectedDates) => {
                setDiscountCodesDeadLine(selectedDates);
              }}
            />
          </InputGroup>
          {discountCodesdDeadLine && (
            <dt className="text-right">
              <small>
                <a href="#" onClick={() => setDiscountCodesDeadLine([])}>
                  clear
                </a>
              </small>
            </dt>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="selectedCustomer">Available for this customer only</Label>
          <Select
            className="react-select"
            value = {{
              label: findAllCustomerSelected
            }}
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
        {editMode && (
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
                (type === 'Amount' || type === 'Percentage') && (newDiscount < 0 || newDiscount > 100) ||
                !newDiscount  ||
                !newRedemption ||
                (type === "Percentage" && !newMaxDiscount) ||
                !(discountCodesdDeadLine && discountCodesdDeadLine.length > 0 ? discountCodesdDeadLine[0] : undefined)
              }
              onClick={editDiscountCodes}
              size="sm"
            >
              {processing ? 'Saving...' : 'Save'}
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

EditDiscountCodesModal.propTypes = {
  currentElement: PropTypes.object,
  customers: PropTypes.array.isRequired,
  discountCodesInformation: PropTypes.array.isRequired,
  editMode: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleModal: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setDiscountCodesInformation: PropTypes.func.isRequired
};
