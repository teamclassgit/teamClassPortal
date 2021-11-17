// @packages
import 'cleave.js/dist/addons/cleave-phone.us';
import Cleave from 'cleave.js/react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Select from 'react-select';
import { Mail, Phone, User, X } from 'react-feather';
import { v4 as uuid } from 'uuid';

// @scripts
import countriesData from '../../../data/countries.json';
import { Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { isValidEmail } from '../../../utility/Utils';

// @styles
import '@styles/react/libs/flatpickr/flatpickr.scss';

const AddNewAttendee = ({
  currentBookingId,
  currentElement,
  data,
  handleModal,
  mode,
  open,
  saveAttendee,
  setData,
  teamClassInfo,
  updateAttendeesCount
}) => {
  const [dynamicValues, setDynamicValues] = useState([]);
  const [dynamicValuesValidation, setDynamicValuesValidation] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [newAddress1, setNewAddress1] = useState('');
  const [newAddress2, setNewAddress2] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [processing, setProcessing] = useState(false);

  const options = { phone: true, phoneRegionCode: 'US' };

  const shippingCountries =
    countriesData &&
    countriesData.countries.map((country) => ({
      label: country.name,
      value: country.name
    }));

  const emailValidation = (email) => {
    setEmailValid(isValidEmail(email));
  };

  const saveNewAttendee = async () => {
    setProcessing(true);

    let additionalFields = (teamClassInfo.registrationFields && teamClassInfo.registrationFields.filter((element) => element.active === true)) || [];

    additionalFields =
      additionalFields &&
      additionalFields.map((item) => {
        const dynamicValue = dynamicValues.find((item2) => item2.name === item.label);
        return {
          name: item.label,
          value: (dynamicValue && dynamicValue.value) || '',
          order: item.order
        };
      });

    try {
      const newElement = {
        id: currentElement && currentElement._id ? currentElement._id : uuid(),
        city: newCity,
        phone: newPhone,
        bookingId: currentBookingId,
        zip: newZip,
        addressLine1: newAddress1,
        addressLine2: newAddress2,
        email: newEmail,
        country: newCountry,
        name: newName,
        state: newState,
        additionalFields
      };

      const savedRow = await saveAttendee(newElement);
      const newData = data.filter((element) => element._id !== savedRow._id);
      newData.push(savedRow);
      setData(newData);
      updateAttendeesCount(newData.length);

      setProcessing(false);

      handleModal();
    } catch (ex) {
      console.log(ex);
      setProcessing(false);
    }
  };

  const cancel = () => {
    handleModal();
  };

  // ** Custom close btn
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  React.useEffect(() => {
    if (currentElement) {
      setNewName(currentElement.name);
      setNewEmail(currentElement.email);
      setNewPhone(currentElement.phone);
      setNewAddress1(currentElement.addressLine1);
      setNewAddress2(currentElement.addressLine2);
      setNewCity(currentElement.city);
      setNewState(currentElement.state);
      setNewZip(currentElement.zip);
      setNewCountry(currentElement.country);
      setDynamicValues(currentElement.additionalFields);
    }
  }, [currentElement]);

  React.useEffect(() => {
    let validationFields = true;
    if (newName && newEmail && newAddress1 && newCity && newState && newZip && newCountry) {
      validationFields = !newName || !newEmail || !newAddress1 || !newCity || !newState || !newZip || !newCountry;
    }
    if (teamClassInfo.registrationFields) {
      teamClassInfo.registrationFields.map((field) => {
        const filteredFields = dynamicValues ? dynamicValues.find((item) => item.name === field.label) : [];
        validationFields = validationFields || (field.required && filteredFields && !filteredFields.value);
      });
    }
    setDynamicValuesValidation(validationFields);
  }, [dynamicValues, newName, newEmail, newAddress1, newCity, newState, newZip, newCountry]);

  const onChangeDynamic = (value, additionalField, field) => {
    if (field.type === 'multiSelectionList') {
      const newArr = value.map((element) => element.label);
      value = newArr.join(' | ');
    }
    if (additionalField) {
      const additionalFieldChanged = { ...additionalField };
      additionalFieldChanged.value = value;
      const newDynamicValues = dynamicValues.filter((item) => item.name !== additionalField.name);
      newDynamicValues.push(additionalFieldChanged);
      setDynamicValues(newDynamicValues);
    } else {
      const newDynamicValues = dynamicValues ? [...dynamicValues] : [];
      const name = field.label;
      const order = field.order;
      newDynamicValues.push({ order, name, value });
      setDynamicValues(newDynamicValues);
    }
  };

  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="mb-3" toggle={handleModal} close={CloseBtn} tag="div">
        {mode === 'edit' ? <h5 className="modal-title">Edit Attendee</h5> : <h5 className="modal-title">New Attendee</h5>}
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <FormGroup>
          <Label for="full-name">Personal Information</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <User size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id="full-name" placeholder="Full Name*" required={true} value={newName} onChange={(e) => setNewName(e.target.value)} />
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
              type="email"
              id="email"
              placeholder="Email*"
              required={true}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              invalid={!emailValid}
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
            <Cleave
              className="form-control"
              placeholder="Phone"
              options={options}
              id="phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="addressLine1">Shipping Address</Label>
          <InputGroup>
            <Input
              id="addressLine1"
              placeholder="Address Line 1*"
              required={true}
              value={newAddress1}
              onChange={(e) => setNewAddress1(e.target.value)}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <Input id="addressLine2" placeholder="Address Line 2" value={newAddress2} onChange={(e) => setNewAddress2(e.target.value)} />
            <Input id="city" placeholder="City*" required={true} value={newCity} onChange={(e) => setNewCity(e.target.value)} />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <Input id="state" placeholder="State*" value={newState} onChange={(e) => setNewState(e.target.value)} />
            <Input
              id="zip"
              type="number"
              placeholder="Zip Code*"
              required={true}
              value={newZip}
              onChange={(e) => {
                setNewZip(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup className="">
          <Label for="country">Country*</Label>
          <Select
            className="selectpicker"
            classNamePrefix='select'
            id="country"
            name="country"
            onChange={(option) => setNewCountry(option.label)}
            options={shippingCountries}
            placeholder="Select.."
            required={true}
            value={{ label: newCountry, value: newCountry }}
          />
        </FormGroup>
        {teamClassInfo.registrationFields && teamClassInfo.registrationFields.length > 0 ? (
          <Label className="mb-1" for="full-name">
            Additional information
          </Label>
        ) : (
          ''
        )}
        {teamClassInfo.registrationFields &&
          teamClassInfo.registrationFields
            .filter((element) => element.active === true)
            .sort((field1, field2) => field1.order < field2.order)
            .map((field, index) => {
              const additionalField = dynamicValues && dynamicValues.find((item) => item.name === field.label);

              return (
                <FormGroup className="ml-0 pl-0">
                  <Label for={field.label}>{field.label + (field.required ? '*' : '')}</Label>
                  {field.type === 'textarea' && (
                    <Input
                      type={field.type}
                      name={field.label}
                      id={field.label}
                      required={field.required}
                      value={additionalField && additionalField.value}
                      onChange={(e) => onChangeDynamic(e.target.value, additionalField, field)}
                    />
                  )}
                  {field.type === 'text' && (
                    <Input
                      type={field.type}
                      name={field.label}
                      id={field.label}
                      required={field.required}
                      value={additionalField && additionalField.value}
                      onChange={(e) => {
                        onChangeDynamic(e.target.value, additionalField, field);
                      }}
                    />
                  )}
                  {field.type === 'number' && (
                    <Input
                      type={field.type}
                      name={field.label}
                      id={field.label}
                      max="1000000"
                      min="0"
                      required={field.required}
                      value={additionalField && additionalField.value}
                      onChange={(e) => onChangeDynamic(e.target.value, additionalField, field)}
                    />
                  )}
                  {field.type === 'list' && (
                    <Input
                      type="select"
                      value={additionalField && additionalField.value}
                      name={field.label}
                      id={field.label}
                      placeholder="Select..."
                      onChange={(e) => onChangeDynamic(e.target.value, additionalField, field)}
                    >
                      <option defaultValue></option>
                      {field.listItems.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </Input>
                  )}
                  {field.type === 'multiSelectionList' && (
                    <Select
                      id={field.label}
                      value={
                        additionalField &&
                        additionalField.value.split(' | ').map((item) => {
                          return {
                            label: item,
                            value: item
                          };
                        })
                      }
                      isMulti
                      classNamePrefix='select'
                      required={field.required}
                      name={field.label}
                      options={field.listItems.map((element) => {
                        return {
                          label: element,
                          value: element
                        };
                      })}
                      onChange={(e) => onChangeDynamic(e, additionalField, field)}
                      className="basic-multi-select"
                    ></Select>
                  )}
                </FormGroup>
              );
            })}
        <Button className="mr-1 mt-1" color="primary" onClick={saveNewAttendee} disabled={processing || dynamicValuesValidation}>
          {processing ? 'Saving...' : 'Save'}
        </Button>
        <Button className="mt-1" color="secondary" onClick={cancel} outline>
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default AddNewAttendee;

AddNewAttendee.propTypes = {
  currentBookingId: PropTypes.string,
  currentElement: PropTypes.object,
  data: PropTypes.object,
  handleModal: PropTypes.func,
  mode: PropTypes.string,
  openModal: PropTypes.bool,
  saveAttendee: PropTypes.func,
  setData: PropTypes.func,
  teamClassInfo: PropTypes.object,
  updateAttendeesCount: PropTypes.func
};

