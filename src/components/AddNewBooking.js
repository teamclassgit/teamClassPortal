// @packages
import Cleave from 'cleave.js/react';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Mail, Phone, User, X, Briefcase } from 'react-feather';
import { selectThemeColors } from '@utils';
import { useMutation } from '@apollo/client';
import { v4 as uuid } from 'uuid';
import { Alert, Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';

// @styles
import '@styles/react/libs/flatpickr/flatpickr.scss';

// @scripts
import 'cleave.js/dist/addons/cleave-phone.us';
import mutationNewBooking from '../graphql/MutationInsertBookingAndCustomer';
import { BOOKING_QUOTE_STATUS, SALES_TAX, SALES_TAX_STATE, SERVICE_FEE } from '../utility/Constants';
import { isValidEmail, getUserData } from '../utility/Utils';

const AddNewBooking = ({ baseElement, classes, coordinators, customers, handleModal, open, onAddCompleted }) => {
  const [attendeesValid, setAttendeesValid] = useState(true);
  const [classVariant, setClassVariant] = useState(null);
  const [classVariantsOptions, setClassVariantsOptions] = useState([]);
  const [createBooking] = useMutation(mutationNewBooking, {});
  const [defaultCoordinatorOption, setDefaultCoordinatorOption] = useState([]);
  const [emailValid, setEmailValid] = useState(true);
  const [isOldCustomer, setIsOldCustomer] = useState(false);
  const [newAttendees, setNewAttendees] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [oneCoordinator, setOneCoordinator] = useState(null);
  const [phoneValid, setPhoneValid] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [warning, setWarning] = useState({ open: false, message: '' });
  const [isGroupVariant, setIsGroupVariant] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [distributorId, setDistributorId] = useState(null);

  const options = { phone: true, phoneRegionCode: 'US' };

  const emailValidation = (email) => {
    setEmailValid(isValidEmail(email));
  };

  const phoneValidation = (phone) => {
    setPhoneValid(true);
  };

  useEffect(() => {
    phoneValidation(newPhone);
  }, [newPhone]);

  const groupSizeValidation = (groupSize) => {
    setAttendeesValid(groupSize > 0);
  };

  useEffect(() => {
    if (selectedClass) {
      const filteredClass = classes.find((element) => element._id === selectedClass);
      if (filteredClass) {
        setClassVariantsOptions(filteredClass.variants);
        setDistributorId(filteredClass?.distributorId);
      }
    }
  }, [selectedClass]);

  useEffect(() => {
    if (baseElement) {
      setNewName(baseElement.name);
      setNewEmail(baseElement.email);
      setNewPhone(baseElement.phone);
      setNewCompany(baseElement.company);
      setNewAttendees(baseElement.attendees);
      setSelectedClass(baseElement.class);
      setSelectedCustomer(null);
      setIsOldCustomer(false);
      setWarning({ open: false, message: '' });

      const userData = getUserData();
      if (userData && userData.customData && userData.customData.coordinatorId) {
        setDefaultCoordinatorOption(userData.customData);
        setOneCoordinator(userData.customData.coordinatorId);
      }
    }
  }, [baseElement]);

  const saveNewBooking = async () => {
    setProcessing(true);

    try {
      let customer = undefined;
      if (isOldCustomer && selectedCustomer) {
        customer = customers.find((element) => element._id === selectedCustomer);
      } else if (customers.find((element) => element.email.toLowerCase() === newEmail.toLowerCase())) {
        setWarning({ open: true, message: 'A customer with the same email already exist.' });
        setProcessing(false);
        return;
      }

      const teamClass = classes.find((element) => element._id === selectedClass);
      const newId = uuid();
      const resultCreateBooking = await createBooking({
        variables: {
          bookingId: newId,
          date: new Date(),
          teamClassId: selectedClass,
          classVariant,
          instructorId: teamClass.instructorId ? teamClass.instructorId : teamClass._id,
          instructorName: teamClass.instructorName,
          customerId: customer ? customer._id : uuid(),
          customerName: customer ? customer.name : newName,
          eventDurationHours: classVariant.duration,
          eventCoordinatorId: oneCoordinator,
          attendees: newAttendees,
          classMinimum: classVariant.minimum,
          pricePerson: classVariant.pricePerson,
          serviceFee: SERVICE_FEE,
          salesTax: SALES_TAX,
          salesTaxState: SALES_TAX_STATE,
          discount: 0,
          customerCreatedAt: customer && customer.createdAt ? customer.createdAt : new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: BOOKING_QUOTE_STATUS,
          email: customer ? customer.email : newEmail,
          phone: customer ? customer.phone : newPhone,
          billingAddress: customer ? customer.billingAddress : null,
          company: customer ? customer.company : newCompany,
          distributorId
        }
      });

      if (!resultCreateBooking || !resultCreateBooking.data) {
        setProcessing(false);
        return;
      }

      setProcessing(false);
      setClassVariant(null);
      setOneCoordinator(null);
      onAddCompleted(newId);
    } catch (ex) {
      console.log(ex);
      setProcessing(false);
    }

    handleModal();
  };

  const cancel = () => {
    setClassVariant(null);
    setOneCoordinator(null);
    handleModal();
  };

  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  const getClassName = (id) => {
    const res = classes.find((element) => element._id === selectedClass);
    return res ? res.title : '';
  };

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
      fontSize: 12
    })
  };

  return (
    <Modal className="sidebar-sm" contentClassName="pt-0" isOpen={open} modalClassName="modal-slide-in">
      <ModalHeader toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">{'New Booking'}</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <div className="demo-inline-spacing ">
          <FormGroup check inline>
            <Label check>
              <Input
                type="radio"
                id="exampleCustomRadio"
                name="customRadio"
                onClick={(e) => {
                  setIsOldCustomer(false);
                  setSelectedCustomer(null);
                }}
                defaultChecked
              />{' '}
              New Customer
            </Label>
          </FormGroup>
          <FormGroup check inline>
            <Label check>
              <Input
                type="radio"
                id="exampleCustomRadio2"
                name="customRadio"
                onClick={(e) => {
                  setIsOldCustomer(true);
                  setWarning({ open: false, message: '' });
                }}
              />{' '}
              Old Customer
            </Label>
          </FormGroup>
        </div>

        {!isOldCustomer && (
          <div>
            <FormGroup>
              <Label for="full-name">Customer Information</Label>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <User size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input id="full-name" placeholder="Full Name *" value={newName} onChange={(e) => setNewName(e.target.value)} />
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
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <Phone size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Cleave
                  className={`${phoneValid ? '' : 'border-danger'} form-control`}
                  placeholder="Phone *"
                  options={options}
                  id="phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  onBlur={(e) => {
                    phoneValidation(e.target.value);
                  }}
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
                <Input id="company" placeholder="Company" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
              </InputGroup>
            </FormGroup>
          </div>
        )}
        {isOldCustomer && (
          <FormGroup>
            <Label for="selectedCustomer">Select Customer</Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              placeholder="Customer Name/Email *"
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
        )}
        <FormGroup>
          <Label for="full-name">Event Coordinator*</Label>

          <Select
            theme={selectThemeColors}
            className="react-select"
            classNamePrefix="select"
            placeholder="Select..."
            defaultValue={{ value: defaultCoordinatorOption._id, label: defaultCoordinatorOption.name }}
            options={
              coordinators &&
              coordinators.map((item) => {
                return {
                  value: item._id,
                  label: item.name
                };
              })
            }
            onChange={(option) => setOneCoordinator(option.value)}
            isClearable={false}
            styles={selectStyles}
          />
        </FormGroup>
        <FormGroup>
          <Label for="full-name">Event Details*</Label>
          <Select
            theme={selectThemeColors}
            className="react-select"
            classNamePrefix="select"
            placeholder="Select one class"
            options={
              classes &&
              classes.map((element) => {
                return {
                  value: element._id,
                  label: element.title
                };
              })
            }
            value={{
              value: selectedClass || '',
              label: getClassName(selectedClass)
            }}
            onChange={(option) => {
              setIsGroupVariant(false);
              setSelectedClass(option.value);
            }}
            isClearable={false}
            styles={selectStyles}
          />
        </FormGroup>
        {selectedClass && (
          <FormGroup>
            <Label for="full-name">Class Variants*</Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              placeholder="Select..."
              options={
                classVariantsOptions &&
                classVariantsOptions.map((element, index) => {
                  const variant = {
                    title: element.title,
                    notes: element.notes,
                    minimum: element.minimum,
                    duration: element.duration,
                    pricePerson: element.pricePerson,
                    hasKit: element.hasKit,
                    order: element.order,
                    active: element.active,
                    groupEvent: element.groupEvent,
                    instructorFlatFee: element.instructorFlatFee,
                    registrationFields: element.registrationFields
                  };

                  return {
                    value: variant,
                    label: element.groupEvent
                      ? `${element.title} ${element.groupEvent ? '/group' : '/person'}`
                      : `${element.title} $${element.pricePerson}${element.groupEvent ? '/group' : '/person'}`
                  };
                })
              }
              onChange={(option) => {
                // eslint-disable-next-line no-unused-expressions
                classVariantsOptions &&
                  classVariantsOptions.map((item, index) => {
                    if (item.title === option.value.title) {
                      setSelectedVariant(index);
                    }
                  });
                if (!option.value.groupEvent) {
                  setIsGroupVariant(false);
                } else {
                  setIsGroupVariant(true);
                }
                setClassVariant(option.value);
              }}
              isClearable={false}
              styles={selectStyles}
            />
          </FormGroup>
        )}
        {isGroupVariant ? (
          <FormGroup>
            <Label for="full-name">Group Size*</Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              placeholder="Select..."
              options={
                classVariantsOptions[selectedVariant] &&
                classVariantsOptions[selectedVariant].priceTiers.map((item) => {
                  const variant = {
                    title: classVariantsOptions[selectedVariant].title,
                    notes: classVariantsOptions[selectedVariant].notes,
                    minimum: item.minimum,
                    maximum: item.maximum,
                    duration: classVariantsOptions[selectedVariant].duration,
                    pricePerson: item.price,
                    hasKit: classVariantsOptions[selectedVariant].hasKit,
                    order: classVariantsOptions[selectedVariant].order,
                    active: classVariantsOptions[selectedVariant].active,
                    groupEvent: classVariantsOptions[selectedVariant].groupEvent,
                    instructorFlatFee: classVariantsOptions[selectedVariant].instructorFlatFee,
                    registrationFields: classVariantsOptions[selectedVariant].registrationFields
                  };
                  return {
                    value: variant,
                    label: `${item.minimum} - ${item.maximum} attendees / $ ${item.price}`
                  };
                })
              }
              onChange={(option) => {
                setClassVariant(option.value);
                setNewAttendees(option.value.maximum);
              }}
              isClearable={false}
              styles={selectStyles}
            />
          </FormGroup>
        ) : (
          <FormGroup>
            <Label for="full-name">Group Size*</Label>
            <InputGroup size="sm">
              <Input
                id="attendees"
                placeholder="Group Size *"
                value={newAttendees}
                onChange={(e) => setNewAttendees(e.target.value)}
                type="number"
                onBlur={(e) => {
                  groupSizeValidation(e.target.value);
                }}
              />
            </InputGroup>
          </FormGroup>
        )}
        <div align="center">
          <Button
            className="mr-1"
            color="primary"
            size="sm"
            onClick={saveNewBooking}
            disabled={
              (!selectedCustomer && (!newName || !newEmail || !newPhone || !emailValid || !phoneValid)) ||
              !newAttendees ||
              processing ||
              !attendeesValid ||
              !selectedClass ||
              !classVariant ||
              !oneCoordinator
            }
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

export default AddNewBooking;
