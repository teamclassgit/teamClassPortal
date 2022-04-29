// @packages
import 'cleave.js/dist/addons/cleave-phone.us';
import Cleave from 'cleave.js/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Mail, Phone, User, X } from 'react-feather';
import { v4 as uuid } from 'uuid';

// @scripts
import countriesData from '../../../data/countries.json';
import { Alert, Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { isValidEmail } from '../../../utility/Utils';

// @styles
import '@styles/react/libs/flatpickr/flatpickr.scss';

const noShippingAlcoholStates = [
  {
    name: 'utah',
    abbreviation: 'UT'
  },
  {
    name: 'oklahoma',
    abbreviation: 'OK'
  },
  {
    name: 'arkansas',
    abbreviation: 'AR'
  },
  {
    name: 'mississippi',
    abbreviation: 'MS'
  },
  {
    name: 'alabama',
    abbreviation: 'AL'
  },
  {
    name: 'Alaska',
    abbreviation: 'AK'
  },
  {
    name: 'delaware',
    abbreviation: 'DE'
  },
  {
    name: 'rhode Island',
    abbreviation: 'RI'
  },
  {
    name: 'Hawaii',
    abbreviation: 'HI'
  },
  {
    name: 'Kentucky',
    abbreviation: 'KY'
  }
];

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
  updateAttendeesCount,
  booking
}) => {
  const [dynamicValues, setDynamicValues] = useState([]);
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
  const [isDeliverKit, setIsDeliverKit] = useState(true);
  const [deliverKitReason, setDeliverKitReason] = useState('');
  const [messageAlert, setMessageAlert] = useState(null);
  const [registrationFields, setRegistrationFields] = useState([]);
  const [validationValues, setValidationValues] = useState(true);

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
  useEffect(() => {
    if (newState || newCountry) {
      const alcoholVariant = teamClassInfo.variants.map((item) => item.kitHasAlcohol);
      teamClassInfo.variants.map((item) => {
        if (item.hasKit && item.kitHasAlcohol) {
          const answer = canDeliverKitToAddress(newState, newCountry, alcoholVariant);
          setIsDeliverKit(answer.canDeliverKit);
          setDeliverKitReason(answer.canDeliverKitReason);
        }
      });
    }
  }, [newState, newCountry]);

  useEffect(() => {
    let validationFields = true;

    if (newName && newEmail && newPhone) {
      validationFields = !newName || !newEmail || !newPhone;
    }

    if (booking && booking.classVariant) {
      const haskitValidation = booking.classVariant && booking.classVariant.hasKit;
      validationFields =
        validationFields ||
        (haskitValidation && !newAddress1) ||
        (haskitValidation && !newCity) ||
        (haskitValidation && !newState) ||
        (haskitValidation && !newZip) ||
        (haskitValidation && !newCountry);
    }

    const requiredAdditionalFields = [
      ...(booking?.classVariant?.registrationFields || teamClassInfo?.registrationFields || []),
      ...(booking?.signUpPageSettings?.additionalRegistrationFields || [])
    ].filter((element) => element.active === true && element.required === true);

    requiredAdditionalFields?.map((field) => {
      const filteredField = dynamicValues?.find((item) => item.name === field.label);
      validationFields = validationFields || !filteredField?.value;
    });

    setValidationValues(validationFields);
  }, [newName, newEmail, newPhone, newAddress1, newCity, newState, newZip, newCountry, dynamicValues]);

  useEffect(() => {
    const fields = [
      ...(booking?.classVariant?.registrationFields || teamClassInfo?.registrationFields || []),
      ...(booking?.signUpPageSettings?.additionalRegistrationFields || [])
    ];
    // const fields = [...(teamClassInfo?.registrationFields || []), ...(bookingInfo?.signUpPageSettings?.additionalRegistrationFields || [])];
    setRegistrationFields(fields.filter((element) => element.active === true));
  }, [teamClassInfo, booking]);

  const canDeliverKitToAddress = (state, country, kitHasAlcohol) => {
    let isShippingAlcohol = false;
    isShippingAlcohol = noShippingAlcoholStates.find(
      (item) => item.name.toLowerCase() === (state && state.toLowerCase()) || item.abbreviation.toLowerCase() === (state && state.toLowerCase())
    )
      ? true
      : false;
    const countryLC = country.toLowerCase();
    if (
      isShippingAlcohol ||
      !(countryLC === 'united states of america' || countryLC === 'usa' || countryLC === 'us' || countryLC === 'united states')
    ) {
      setMessageAlert("Notice: kit contains alcohol and can't be delivered to your address due to shipping restrictions.");
      return { canDeliverKit: false, canDeliverKitReason: 'Alcohol can not be delivery to shipping address' };
    } else {
      setMessageAlert(null);
      return { canDeliverKit: true, canDeliverKitReason: '' };
    }
  };

  const saveNewAttendee = async () => {
    setProcessing(true);

    try {
      let additionalFields = [
        ...(booking?.classVariant?.registrationFields || teamClassInfo?.registrationFields || []),
        ...(booking?.signUpPageSettings?.additionalRegistrationFields || [])
      ].filter((element) => element.active === true);
      additionalFields = dynamicValues
        ? additionalFields &&
          additionalFields.map((item) => {
            const dynamicValue = dynamicValues.find((item2) => item2.name === item.label);
            return {
              name: item.label,
              value: (dynamicValue && dynamicValue.value) || '',
              order: item.order
            };
          })
        : [];

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
        canDeliverKit: isDeliverKit,
        canDeliverKitReason: deliverKitReason,
        additionalFields
      };

      const savedRow = await saveAttendee(newElement);
      const newData = data.filter((element) => element._id !== savedRow._id);
      newData.push(savedRow);
      setData(newData);
      updateAttendeesCount(newData.length);

      handleModal();
    } catch (ex) {
      console.log(ex);
    }

    setProcessing(false);
  };

  const cancel = () => {
    handleModal();
  };

  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  useEffect(() => {
    if (currentElement) {
      setDynamicValues(currentElement?.additionalFields);
      setNewAddress1(currentElement.addressLine1);
      setNewAddress2(currentElement.addressLine2);
      setNewCity(currentElement.city);
      setNewCountry(currentElement.country);
      setNewEmail(currentElement.email);
      setNewName(currentElement.name);
      setNewPhone(currentElement.phone);
      setNewState(currentElement.state);
      setNewZip(currentElement.zip);
    }
  }, [currentElement]);

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
    <Modal className="sidebar-sm" contentClassName="pt-0" isOpen={open} modalClassName="modal-slide-in">
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
              placeholder="Email"
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
        {booking.classVariant.hasKit && (
          <FormGroup>
            <FormGroup>
              <Label for="addressLine1">Shipping Address</Label>
              <InputGroup>
                <Input
                  id="addressLine1"
                  placeholder="Address Line 1"
                  required={booking.classVariant.hasKit ? true : false}
                  value={newAddress1}
                  onChange={(e) => setNewAddress1(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <Input id="addressLine2" placeholder="Address Line 2" value={newAddress2} onChange={(e) => setNewAddress2(e.target.value)} />
                <Input
                  id="city"
                  placeholder="City"
                  required={booking.classVariant.hasKit ? true : false}
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <Input
                  id="state"
                  placeholder="State"
                  required={booking.classVariant.hasKit ? true : false}
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                />
                <Input
                  id="zip"
                  type="number"
                  placeholder="Zip Code"
                  required={booking.classVariant.hasKit ? true : false}
                  value={newZip}
                  onChange={(e) => {
                    setNewZip(e.target.value);
                  }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup className="">
              <Label for="country">Country</Label>
              <Select
                className="selectpicker"
                classNamePrefix="select"
                id="country"
                name="country"
                onChange={(option) => setNewCountry(option.label)}
                options={shippingCountries}
                placeholder="Select.."
                required={booking.classVariant.hasKit ? true : false}
                value={{ label: newCountry, value: newCountry }}
              />
            </FormGroup>
          </FormGroup>
        )}
        {messageAlert && (
          <Alert color="warning" className="p-1 small">
            {messageAlert}
          </Alert>
        )}
        {registrationFields && registrationFields.length > 0 ? (
          <Label className="mb-1" for="full-name">
            Additional information
          </Label>
        ) : (
          ''
        )}
        {registrationFields &&
          registrationFields
            .sort((field1, field2) => field1.order < field2.order)
            .map((field, index) => {
              const additionalField = dynamicValues && dynamicValues.find((item) => item.name === field.label);
              return (
                <FormGroup className="ml-0 pl-0">
                  <Label for={field.label}>{field.label}</Label>
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
                      classNamePrefix="select"
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
        <Button className="mr-1 mt-1" color="primary" onClick={saveNewAttendee} disabled={processing || validationValues}>
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
