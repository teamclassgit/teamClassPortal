// @packages
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CustomInput,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import Cleave from 'cleave.js/react';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import classnames from 'classnames';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { Mail, Phone, User, X, Briefcase, Info, Settings, Edit, Video, Key, Truck, List } from 'react-feather';

// @scripts
import closeBookingOptions from './ClosedBookingOptions.json';
import mutationOpenBooking from '../graphql/MutationOpenBooking';
import mutationCloseBooking from '../graphql/MutationCloseBooking';
import mutationUpdateBooking from '../graphql/MutationUpdateBookingAndCustomer';
import mutationUpdateBookingNotes from '../graphql/MutationUpdateBookingNotes';
import mutationUpdateCalendarEventByBookindId from '../graphql/MutationUpdateCalendarEventByBookindId';
import removeCampaignRequestQuoteMutation from '../graphql/email/removeCampaignRequestQuote';
import { getUserData, isValidEmail, isUrlValid } from '../utility/Utils';
import { selectThemeColors } from '@utils';
import {
  BOOKING_CLOSED_STATUS,
  BOOKING_DATE_REQUESTED_STATUS,
  BOOKING_DEPOSIT_CONFIRMATION_STATUS,
  BOOKING_PAID_STATUS,
  BOOKING_QUOTE_STATUS,
  DATE_AND_TIME_CANCELED_STATUS,
  DATE_AND_TIME_CONFIRMATION_STATUS,
  DATE_AND_TIME_RESERVED_STATUS
} from '../utility/Constants';

// @styles
import './EditBookingModal.scss';

const EditBookingModal = ({ currentElement, allClasses, allCoordinators, editMode, handleClose, handleModal, open, onEditCompleted, allInstructors }) => {
  const [active, setActive] = useState('1');
  const [attendeesValid, setAttendeesValid] = useState(true);
  const [bookingNotes, setBookingNotes] = useState([]);
  const [bookingSignUpDeadline, setBookingSignUpDeadline] = useState([]);
  const [bookingTeamClassId, setBookingTeamClassId] = useState(null);
  const [bookingTeamClassName, setBookingTeamClassName] = useState(null);
  const [calendarEvent, setCalendarEvent] = useState(null);
  const [classVariant, setClassVariant] = useState(null);
  const [classVariantsOptions, setClassVariantsOptions] = useState([]);
  const [closedBookingReason, setClosedBookingReason] = useState(null);
  const [coordinatorId, setCoordinatorId] = useState(null);
  const [coordinatorName, setCoordinatorName] = useState(null);
  const [instructorId, setInstructorId] = useState(null);
  const [instructorName, setInstructorName] = useState(null);
  const [instructorAndAdditionals, setInstructorAndAdditionals] = useState([]);
  const [customerCompany, setCustomerCompany] = useState(null);
  const [customerEmail, setCustomerEmail] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [customerPhone, setCustomerPhone] = useState(null);
  const [emailValid, setEmailValid] = useState(true);
  const [groupSize, setGroupSize] = useState(null);
  const [inputNote, setInputNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isCapRegistration, setIsCapRegistration] = useState(false);
  const [isGroupVariant, setIsGroupVariant] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedPriceTier, setSelectedPriceTier] = React.useState(null);
  const [selectedMinimumTier, setSelectedMinimumTier] = React.useState(null);
  const [selectedMaximumTier, setSelectedMaximumTier] = React.useState(null);
  const [distributorId, setDistributorId] = useState(null);
  const [joinLink, setJoinLink] = useState('');
  const [passwordLink, setPasswordLink] = useState('');
  const [trackingLink, setTrackingLink] = useState('');
  const [isValidUrl, setIsValidUrl] = useState({
    trackingLink: true,
    joinUrl: true
  });
  const [classOptionsTags, setClassOptionsTags] = useState([]);
  const [individualTag, setIndividualTag] = useState('');
  const [bookingTags, setBookingTags] = useState([]);

  const [removeCampaignRequestQuote] = useMutation(removeCampaignRequestQuoteMutation, {});
  const [updateBookingNotes] = useMutation(mutationUpdateBookingNotes, {});
  const [updateBooking] = useMutation(mutationUpdateBooking, {});
  const [updateCalendarEventStatus] = useMutation(mutationUpdateCalendarEventByBookindId, {});
  const [updateOpenBooking] = useMutation(mutationOpenBooking, {});
  const [updateCloseBooking] = useMutation(mutationCloseBooking, {});

  useEffect(() => {
    if (!currentElement?._id) return;

    const teamClass = allClasses.find((element) => element._id === currentElement.teamClassId);
    const coordinator = allCoordinators.find((element) => element._id === currentElement.eventCoordinatorId);
    const instructor = allInstructors.find((element) => element._id === currentElement.instructorId);
    const customer = currentElement.customer;
    const filteredClass = allClasses.find((element) => element._id === teamClass?._id);

    setBookingNotes(currentElement.notes);
    setBookingSignUpDeadline([currentElement.signUpDeadline]);
    setBookingTeamClassId(teamClass?._id);
    setBookingTeamClassName(teamClass?.title);
    setClassVariant(currentElement.classVariant);
    setClosedBookingReason(currentElement.closedReason);
    setCoordinatorId(coordinator?._id);
    setCoordinatorName(coordinator?.name);
    setInstructorId(instructor?._id);
    setInstructorName(instructor?.name);
    setCustomerCompany(customer?.company);
    setCustomerEmail(customer?.email);
    setCustomerName(customer?.name);
    setCustomerPhone(customer?.phone);
    setGroupSize(currentElement.attendees);
    setIsCapRegistration(currentElement.capRegistration);
    setCalendarEvent(currentElement.calendarEvent);
    setSelectedPriceTier(currentElement.classVariant && currentElement.classVariant.pricePerson);
    setSelectedMinimumTier(currentElement.classVariant && currentElement.classVariant.minimum);
    setSelectedMaximumTier(currentElement.classVariant && currentElement.classVariant.maximum);
    setTrackingLink(currentElement.shippingTrackingLink);
    setJoinLink(currentElement.joinInfo && currentElement.joinInfo.joinUrl);
    setPasswordLink(currentElement.joinInfo && currentElement.joinInfo.password);
    setIsGroupVariant(currentElement.classVariant && currentElement.classVariant.groupEvent ? true : false);
    setClassVariantsOptions(filteredClass?.variants);
    setDistributorId(currentElement?.distributorId);
    setClassOptionsTags(currentElement?.additionalClassOptions || []);

    if (teamClass && teamClass?.additionalInstructors) {
      setInstructorAndAdditionals([...teamClass?.additionalInstructors, teamClass?.instructorId]);
    } else {
      setInstructorAndAdditionals([teamClass?.instructorId]);
    }
  }, [currentElement]);

  useEffect(() => {
    if (classVariant && classVariant.groupEvent) {
      // eslint-disable-next-line no-unused-expressions
      classVariantsOptions &&
        classVariantsOptions.map((item, index) => {
          if (item.title === classVariant.title) {
            setSelectedVariant(index);
          }
        });
      setSelectedPriceTier(classVariant.pricePerson);
      setSelectedMinimumTier(classVariant.minimum);
      setSelectedMaximumTier(classVariant.maximum);
      setIsGroupVariant(true);
    } else {
      setIsGroupVariant(false);
    }
  }, [classVariant]);

  const emailValidation = (email) => {
    setEmailValid(isValidEmail(email));
  };

  const urlValidation = ({ target }) => {
    const { name, value } = target;
    setIsValidUrl({ ...isValidUrl, [name]: isUrlValid(value) });
  };

  const options = { phone: true, phoneRegionCode: 'US' };

  const cancel = () => {
    setClosedBookingReason(null);
    setIsValidUrl({
      trackingLink: true,
      joinUrl: true
    });
    handleModal({});
  };

  const groupSizeValidation = (size) => {
    setAttendeesValid(size > 0);
  };

  const getStatusToReOpenBooking = () => {
    const currentPayments = currentElement.payments;

    if (!calendarEvent) {
      return BOOKING_QUOTE_STATUS;
    } else if (currentPayments && currentPayments.length > 0) {
      const depositPayment =
        currentPayments && currentPayments.find((element) => element.paymentName === 'deposit' && element.status === 'succeeded');
      const finalPayment = currentPayments && currentPayments.find((element) => element.paymentName === 'final' && element.status === 'succeeded');
      if (finalPayment) {
        return BOOKING_PAID_STATUS;
      } else if (depositPayment) {
        return BOOKING_DEPOSIT_CONFIRMATION_STATUS;
      }
    }

    return BOOKING_DATE_REQUESTED_STATUS;
  };

  const getStatusToReOpenCalendarEvent = (openBookingStatus) => {
    let calendarEventStatus = DATE_AND_TIME_RESERVED_STATUS;
    if (openBookingStatus === BOOKING_PAID_STATUS || openBookingStatus === BOOKING_DEPOSIT_CONFIRMATION_STATUS) {
      calendarEventStatus = DATE_AND_TIME_CONFIRMATION_STATUS;
    }
    return calendarEventStatus;
  };

  const closeBooking = async () => {
    setProcessing(true);
    const teamClass = allClasses.find((element) => element._id === bookingTeamClassId);
    let joinInfo = { ...currentElement.joinInfo };
    if (!joinLink && !passwordLink) {
      joinInfo = undefined;
    } else if (joinInfo && joinInfo.joinUrl) {
      joinInfo.joinUrl = joinLink;
      joinInfo.password = passwordLink;
    } else {
      joinInfo = {
        joinUrl: joinLink,
        password: passwordLink
      };
    }
    try {
      const resultCloseBooking = await updateCloseBooking({
        variables: {
          bookingId: currentElement._id,
          date: new Date(),
          teamClassId: bookingTeamClassId,
          classVariant,
          instructorId: teamClass.instructorId,
          instructorName: teamClass.instructorName,
          customerId: currentElement.customerId,
          customerName,
          instructorId,
          instructorName,
          eventDate: new Date(),
          eventDurationHours: classVariant.duration ? classVariant.duration : currentElement.eventDurationHours,
          eventCoordinatorId: coordinatorId,
          attendees: groupSize,
          classMinimum: classVariant.minimum,
          pricePerson: classVariant.pricePerson,
          serviceFee: currentElement.serviceFee,
          salesTax: currentElement.salesTax,
          discount: currentElement.discount,
          createdAt: currentElement.createdAt,
          updatedAt: new Date(),
          status: 'closed',
          email: customerEmail,
          phone: customerPhone,
          company: customerCompany,
          signUpDeadline: bookingSignUpDeadline && bookingSignUpDeadline.length > 0 ? bookingSignUpDeadline[0] : undefined,
          closedReason: closedBookingReason,
          notes: bookingNotes,
          capRegistration: isCapRegistration,
          shippingTrackingLink: trackingLink,
          joinInfo,
          joinInfo_unset: joinInfo ? false : true,
          distributorId,
          distributorId_unset: distributorId ? false : true,
          additionalClassOptions: classOptionsTags,
          tags: bookingTags
        }
      });

      if (!resultCloseBooking || !resultCloseBooking.data) {
        setProcessing(false);
        return;
      }

      if (closedBookingReason) {
        const resultEmail = await removeCampaignRequestQuote({
          variables: { customerEmail: customerEmail.toLowerCase() }
        });
        console.log('Remove campaign before redirecting:', resultEmail);
      }

      if (
        closedBookingReason === 'Lost' ||
        closedBookingReason === 'Duplicated' ||
        closedBookingReason === 'Mistake' ||
        closedBookingReason === 'Test'
      ) {
        if (calendarEvent) {
          const resultStatusUpdated = await updateCalendarEventStatus({
            variables: {
              calendarEventId: calendarEvent._id,
              status: DATE_AND_TIME_CANCELED_STATUS
            }
          });
          console.log('Changing calendar event status', resultStatusUpdated);
        }
      }

      onEditCompleted(currentElement._id);
    } catch (ex) {
      console.log('err', ex);
    }
    setProcessing(false);
    handleModal();
  };

  const openBooking = async () => {
    setProcessing(true);

    try {
      const reOpenBookingStatus = getStatusToReOpenBooking();
      const resultUpdateBooking = await updateOpenBooking({
        variables: {
          bookingId: currentElement._id,
          updatedAt: new Date(),
          status: reOpenBookingStatus
        }
      });

      if (!resultUpdateBooking || !resultUpdateBooking.data) {
        setProcessing(false);
        return;
      }

      if (reOpenBookingStatus !== BOOKING_QUOTE_STATUS && calendarEvent && calendarEvent.status === DATE_AND_TIME_CANCELED_STATUS) {
        const calendarEventStatus = getStatusToReOpenCalendarEvent(reOpenBookingStatus);
        const resultStatusUpdated = await updateCalendarEventStatus({
          variables: {
            calendarEventId: calendarEvent._id,
            status: calendarEventStatus
          }
        });
        console.log('Changing calendar event status', resultStatusUpdated);
      }

      onEditCompleted(currentElement._id);
    } catch (ex) {
      console.log(ex);
    }

    setProcessing(false);
    handleModal();
  };

  const saveChangesBooking = async () => {
    setProcessing(true);

    try {
      const teamClass = allClasses.find((element) => element._id === bookingTeamClassId);
      let joinInfo = { ...currentElement.joinInfo };
      if (!joinLink && !passwordLink) {
        joinInfo = undefined;
      } else if (joinInfo && joinInfo.joinUrl) {
        joinInfo.joinUrl = joinLink;
        joinInfo.password = passwordLink;
      } else {
        joinInfo = {
          joinUrl: joinLink,
          password: passwordLink
        };
      }
      const resultUpdateBooking = await updateBooking({
        variables: {
          bookingId: currentElement._id,
          date: new Date(),
          teamClassId: bookingTeamClassId,
          classVariant,
          instructorId: teamClass.instructorId,
          instructorName: teamClass.instructorName,
          customerId: currentElement.customerId,
          customerName,
          eventDate: new Date(),
          instructorId,
          instructorName,
          eventDurationHours: classVariant.duration ? classVariant.duration : currentElement.eventDurationHours,
          eventCoordinatorId: coordinatorId,
          attendees: groupSize,
          classMinimum: classVariant.minimum,
          pricePerson: classVariant.pricePerson,
          serviceFee: currentElement.serviceFee,
          salesTax: currentElement.salesTax,
          discount: currentElement.discount,
          createdAt: currentElement.createdAt,
          updatedAt: new Date(),
          email: customerEmail,
          phone: customerPhone,
          company: customerCompany,
          signUpDeadline: bookingSignUpDeadline && bookingSignUpDeadline.length > 0 ? bookingSignUpDeadline[0] : undefined,
          notes: bookingNotes,
          capRegistration: isCapRegistration,
          shippingTrackingLink: trackingLink,
          joinInfo,
          joinInfo_unset: joinInfo ? false : true,
          distributorId,
          distributorId_unset: distributorId ? false : true,
          additionalClassOptions: classOptionsTags,
          tags: bookingTags
        }
      });

      if (!resultUpdateBooking || !resultUpdateBooking.data) {
        setProcessing(false);
        return;
      }

      onEditCompleted(currentElement._id);
    } catch (ex) {
      console.log(ex);
    }

    setProcessing(false);
    handleModal();
  };

  const saveNotes = async () => {
    setProcessing(true);
    const newArray = bookingNotes ? [...bookingNotes] : [];
    const userData = getUserData();
    newArray.unshift({
      note: inputNote,
      author: (userData && userData.customData && userData.customData['name']) || 'Unknown',
      date: new Date()
    });

    try {
      await updateBookingNotes({
        variables: {
          id: currentElement._id,
          notes: newArray,
          updatedAt: new Date()
        }
      });
      setBookingNotes(newArray.sort((a, b) => (a.date > b.date ? -1 : 1)));
    } catch (ex) {
      console.log(ex);
    }
    setProcessing(false);
  };

  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const onChangeNotes = () => {
    saveNotes();
    setInputNote('');
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
      paddingBottom: 7,
      fontSize: 12
    })
  };

  const selectStylesTags = {
    control: (base) => ({
      ...base,
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
      paddingTop: 7,
      fontSize: 12
    })
  };

  const handleAddition = (e) => {
    if (e.key === 'Enter') {
      setIndividualTag('');
      const tag = {
        id: e.target.value,
        text: e.target.value
      };
      setClassOptionsTags([...classOptionsTags, tag]);
    }
  };

  const handleDelete = (i) => {
    setClassOptionsTags(classOptionsTags.filter((_, index) => index !== i));
  };

  const tagsList = [
    { value: 'manual', label: 'Manual' },
    { value: 'spam', label: 'Spam' },
    { value: 'drift', label: 'Drift' },
    { value: 'referral', label: 'Referral' }
  ];

  return (
    <Modal isOpen={open} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0" onClosed={() => handleClose()}>
      <ModalHeader toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">Edit Booking</h5>
      </ModalHeader>
      <Nav tabs className="d-flex justify-content-around mt-1">
        <NavItem>
          <NavLink
            title="Basic information"
            active={active === '1'}
            onClick={() => {
              toggle('1');
            }}
          >
            <Info size="18" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            title="Settings"
            active={active === '2'}
            onClick={() => {
              toggle('2');
            }}
          >
            <Settings size="18" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink title="Notes" active={active === '3'} onClick={() => toggle('3')}>
            <Edit size="18" />
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active} color="primary">
        <TabPane tabId="1">
          <ModalBody className="flex-grow-1">
            <FormGroup>
              <Label for="full-name">
                <strong>Id:</strong> <span className="text-primary">{`${currentElement?._id}`}</span>
              </Label>
            </FormGroup>
            <FormGroup>
              <Label for="full-name">Customer Information</Label>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <User size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="full-name"
                  disabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                  placeholder="Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
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
                  disabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                  placeholder="Email *"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
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
                  className="form-control"
                  placeholder="Phone *"
                  disabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                  options={options}
                  id="phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
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
                  disabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                  placeholder="Company"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label>Event Instructor*</Label>
              <Select
                theme={selectThemeColors}
                styles={selectStyles}
                isDisabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                className="react-select edit-booking-select-instructor"
                classNamePrefix="select"
                placeholder="Select..."
                value={{
                  label: instructorName,
                  value: instructorId
                }}
                options={
                  allInstructors &&
                  allInstructors.filter(instructor => (instructorAndAdditionals?.includes(instructor._id)))
                  .map((instructor) => {
                    return {
                      value: instructor._id,
                      label: instructor.name
                    };
                  })
                }
                onChange={(option) => {
                  setInstructorId(option.value);
                  setInstructorName(option.label);
                }}
                isClearable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label for="full-name">Event Coordinator*</Label>
              <Select
                theme={selectThemeColors}
                styles={selectStyles}
                isDisabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                className="react-select edit-booking-select-coordinator"
                classNamePrefix="select"
                placeholder="Select..."
                value={{
                  label: coordinatorName,
                  value: coordinatorId
                }}
                options={
                  allCoordinators &&
                  allCoordinators.map((item) => {
                    return {
                      value: item._id,
                      label: item.name
                    };
                  })
                }
                onChange={(option) => {
                  setCoordinatorId(option.value);
                  setCoordinatorName(option.label);
                }}
                isClearable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label for="full-name">Event Details*</Label>
              <Select
                styles={selectStyles}
                isDisabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false || currentElement.status !== BOOKING_QUOTE_STATUS}
                theme={selectThemeColors}
                className="react-select edit-booking-select-class"
                classNamePrefix="select"
                placeholder="Select one class"
                options={
                  allClasses &&
                  allClasses.map((element) => {
                    return {
                      value: element._id,
                      label: element.title
                    };
                  })
                }
                value={{
                  value: bookingTeamClassId || '',
                  label: bookingTeamClassName
                }}
                onChange={(option) => {
                  const filteredClass = allClasses.find((element) => element._id === option.value);
                  if (filteredClass) setDistributorId(filteredClass?.distributorId);
                  setClassVariantsOptions(filteredClass.variants);
                  setClassVariant(null);
                  setBookingTeamClassId(option.value);
                  setBookingTeamClassName(option.label);
                }}
                isClearable={false}
              />
            </FormGroup>

            <FormGroup>
              <Label for="full-name">Class Variant*</Label>
              <Select
                theme={selectThemeColors}
                isDisabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                styles={selectStyles}
                className="react-select edit-booking-select-variant"
                classNamePrefix="select"
                placeholder="Select..."
                value={{
                  label:
                    classVariant && classVariant.groupEvent
                      ? `${classVariant && classVariant.title ? classVariant.title : ''} ${
                          classVariant && classVariant.groupEvent ? '/group' : '/person'
                        }`
                      : `${classVariant && classVariant.title ? classVariant.title : ''} $${
                          classVariant && classVariant.pricePerson ? classVariant.pricePerson : ''
                        }${classVariant && classVariant.groupEvent ? '/group' : '/person'}`,
                  value: classVariant
                }}
                options={
                  classVariantsOptions &&
                  classVariantsOptions.map((element) => {
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
                      instructorFlatFee: element.instructorFlatFee
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
                  setGroupSize('');
                }}
                isClearable={false}
              />
            </FormGroup>
            {classVariant && classVariant.groupEvent ? (
              <FormGroup className="mt-1">
                <Label for="full-name">Group Size*</Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select edit-booking-select-size"
                  classNamePrefix="select"
                  placeholder="Select..."
                  isDisabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                  value={{
                    label: `${selectedMinimumTier ? selectedMinimumTier : ''} - ${selectedMaximumTier ? selectedMaximumTier : ''} attendees / $ ${
                      selectedPriceTier ? selectedPriceTier : ''
                    }`,
                    value: classVariant
                  }}
                  options={
                    classVariantsOptions[selectedVariant] &&
                    classVariantsOptions[selectedVariant].priceTiers &&
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
                        instructorFlatFee: classVariantsOptions[selectedVariant].instructorFlatFee
                      };
                      return {
                        value: variant,
                        label: `${item.minimum} - ${item.maximum} attendees / $ ${item.price}`
                      };
                    })
                  }
                  onChange={(option) => {
                    setClassVariant(option.value);
                    setGroupSize(option.value.maximum);
                  }}
                  isClearable={false}
                  styles={selectStyles}
                />
              </FormGroup>
            ) : (
              <FormGroup className="mt-1">
                <Label for="full-name">Group Size*</Label>
                <InputGroup size="sm">
                  <Input
                    id="attendees"
                    disabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                    placeholder="Group Size *"
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    type="number"
                    onBlur={(e) => {
                      groupSizeValidation(e.target.value);
                    }}
                  />
                </InputGroup>
              </FormGroup>
            )}
            <FormGroup>
              <CustomInput
                type="switch"
                className="edit-booking-switch"
                id="exampleCustomSwitch"
                name="customSwitch"
                label="Turn on/off registration's cap based on group size"
                disabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                inline
                value={isCapRegistration}
                checked={isCapRegistration}
                onChange={(e) => {
                  setIsCapRegistration(!isCapRegistration);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="date-time-picker">Sign Up Deadline (Custom)</Label>
              <InputGroup size="sm">
                <Flatpickr
                  disabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                  value={bookingSignUpDeadline}
                  dateformat="Y-m-d H:i"
                  data-enable-time={true}
                  id="signUpDateLine"
                  className="flatpickr form-control"
                  placeholder="Select Date..."
                  onChange={(selectedDates, dateStr, instance) => {
                    setBookingSignUpDeadline(selectedDates);
                  }}
                />
              </InputGroup>
              {bookingSignUpDeadline && currentElement.status !== BOOKING_CLOSED_STATUS && (
                <dt className="text-right">
                  <small>
                    <a href="#" onClick={(e) => setBookingSignUpDeadline([])}>
                      clear
                    </a>
                  </small>
                </dt>
              )}
            </FormGroup>
            <FormGroup>
              {currentElement.status === BOOKING_CLOSED_STATUS ? (
                <span className="text-lg">
                  Closed with reason: <strong>{currentElement.closedReason}</strong>
                </span>
              ) : (
                <>
                  <Label for="full-name">Close this booking with reason: </Label>
                  <Select
                    styles={selectStyles}
                    value={{
                      label: closedBookingReason,
                      value: closedBookingReason
                    }}
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Select one reason.."
                    options={closeBookingOptions.map((item) => {
                      return {
                        label: item.label,
                        value: item.value
                      };
                    })}
                    onChange={(option) => setClosedBookingReason(option.value)}
                    isClearable={false}
                  />
                </>
              )}
            </FormGroup>

            {editMode && (
              <div align="center">
                <Button
                  className="mr-1"
                  size="sm"
                  color={closedBookingReason ? 'danger' : 'primary'}
                  onClick={() => {
                    if (closedBookingReason) {
                      closeBooking();
                    } else {
                      saveChangesBooking();
                    }
                  }}
                  disabled={
                    !customerName ||
                    !customerEmail ||
                    !emailValid ||
                    !customerPhone ||
                    !coordinatorId ||
                    !bookingTeamClassId ||
                    !classVariant ||
                    !groupSize
                  }
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
            {currentElement.status === BOOKING_CLOSED_STATUS && (
              <div align="center">
                <Button
                  className="mr-1"
                  size="sm"
                  color={'danger'}
                  onClick={() => {
                    openBooking();
                  }}
                  disabled={
                    !customerName ||
                    !customerEmail ||
                    !emailValid ||
                    !customerPhone ||
                    !coordinatorId ||
                    !bookingTeamClassId ||
                    !classVariant ||
                    !groupSize
                  }
                >
                  {processing ? 'Opening...' : 'Back to open status'}
                </Button>
                <Button color="secondary" size="sm" onClick={cancel} outline>
                  Cancel
                </Button>
              </div>
            )}
          </ModalBody>
        </TabPane>
        <TabPane tabId="3">
          <b className="text-primary ml-2">Notes</b>
          <Card className="notes-card mt-1">
            <CardBody>
              <ul className="timeline p-0 m-0">
                {bookingNotes && bookingNotes.length > 0 ? (
                  bookingNotes.map((item, index) => {
                    return (
                      <li key={index} className="timeline-item">
                        <span className={classnames('timeline-point timeline-point-secondary timeline-point-indicator')}>
                          {item.icon ? item.icon : null}
                        </span>
                        <div className="timeline-event">
                          <div className={classnames('d-flex justify-content-between flex-sm-row flex-column')}>
                            <small>
                              <strong>{item.author && item.author.split(' ')[0]}</strong>
                            </small>
                            <span className="timeline-event-time">
                              <small>{moment(item.date).fromNow()}</small>
                            </span>
                          </div>
                          <p
                            className={classnames({
                              'mb-0': index === bookingNotes.length - 1 && !item.customContent
                            })}
                          >
                            <small>{item.note}</small>
                          </p>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li>
                    <p>Write your first note below...</p>
                  </li>
                )}
              </ul>
            </CardBody>
          </Card>
          <div className=" ml-2 mr-2" align="right">
            <Input className="" type="textarea" id="bookingNotes" value={inputNote} onChange={(e) => setInputNote(e.target.value)} />
            <Button onClick={onChangeNotes} size="sm" className="mt-1" color="primary" disabled={!inputNote}>
              {processing ? 'Saving note...' : 'Add Note'}
            </Button>
          </div>
        </TabPane>
        <TabPane tabId="2">
          <ModalBody className="flex-grow-1">
            <FormGroup>
              <Label for="joinUrl">
                <strong>Id:</strong> <span className="text-primary">{`${currentElement?._id}`}</span>
              </Label>
            </FormGroup>
            <FormGroup>
              <Label for="joinUrl">Event join info</Label>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <Video size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="text"
                  id="joinUrl"
                  name="joinUrl"
                  placeholder="Event link"
                  value={joinLink}
                  onChange={(e) => setJoinLink(e.target.value)}
                  onBlur={(e) => urlValidation(e)}
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
                  type="text"
                  id="key"
                  name="key"
                  placeholder="Event password"
                  value={passwordLink}
                  onChange={(e) => setPasswordLink(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="trackingLink">Shipping tracking</Label>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <Truck size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="text"
                  id="trackingLink"
                  name="trackingLink"
                  placeholder="Tracking doc link"
                  value={trackingLink}
                  onChange={(e) => setTrackingLink(e.target.value)}
                  onBlur={(e) => urlValidation(e)}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label for="classOptions">Additional class options</Label>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <List size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="text"
                  id="classOptions"
                  name="classOptions"
                  placeholder="New options"
                  disabled={classOptionsTags.length >= 20 ? true : false}
                  onChange={(e) => setIndividualTag(e.target.value)}
                  value={individualTag}
                  onKeyDown={handleAddition}
                />
              </InputGroup>
            </FormGroup>

            {classOptionsTags &&
              classOptionsTags.map((tag, index) => (
                <div className="pb-2">
                  <span className="tags mb-1">
                    {tag.text}
                    <a href="#" className="pl-1" onClick={() => handleDelete(index)}>
                      x
                    </a>
                  </span>
                </div>
              )
            )}

            <FormGroup>
              <Label for="selectedtags">Tags</Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                placeholder="Booking tags"
                options={tagsList}
                isMulti
                closeMenuOnSelect={false}
                styles={selectStylesTags}
                defaultValue={tagsList.map(tag => currentElement?.tags?.includes(tag.value) && tag)}
                onChange={(element) => setBookingTags(element.map(tag => tag.value))}
              />
            </FormGroup>

            {editMode && (
              <div align="center">
                <Button
                  className="mr-1"
                  size="sm"
                  color={closedBookingReason ? 'danger' : 'primary'}
                  onClick={saveChangesBooking}
                  disabled={
                    !customerName ||
                    !customerEmail ||
                    !emailValid ||
                    !customerPhone ||
                    !coordinatorId ||
                    !bookingTeamClassId ||
                    !classVariant ||
                    !groupSize ||
                    !isValidUrl.joinUrl ||
                    !isValidUrl.trackingLink
                  }
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
          </ModalBody>
        </TabPane>
      </TabContent>
    </Modal>
  );
};

export default EditBookingModal;
