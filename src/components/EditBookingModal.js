// @packages
import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
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
} from "reactstrap";
import Cleave from "cleave.js/react";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useQuery, useMutation } from "@apollo/client";
import { Mail, Phone, User, X, Briefcase, Info, Settings, MessageSquare, Users } from "react-feather";

// @scripts
import closeBookingOptions from "./ClosedBookingOptions.json";
import QueryInstructorTeamMemberById from "../graphql/QueryInstructorTeamMemberById";
import QueryInstructorById from "../graphql/QueryInstructorById";
import mutationOpenBooking from "../graphql/MutationOpenBooking";
import mutationCloseBooking from "../graphql/MutationCloseBooking";
import mutationUpdateBooking from "../graphql/MutationUpdateBookingAndCustomer";
import mutationUpdateCalendarEventByBookindId from "../graphql/MutationUpdateCalendarEventByBookindId";
import removeCampaignRequestQuoteMutation from "../graphql/email/removeCampaignRequestQuote";
import { isValidEmail } from "../utility/Utils";
import { selectThemeColors } from "@utils";
import {
  BOOKING_CLOSED_STATUS,
  BOOKING_DEPOSIT_CONFIRMATION_STATUS,
  BOOKING_PAID_STATUS,
  BOOKING_QUOTE_STATUS,
  DATE_AND_TIME_CANCELED_STATUS
} from "../utility/Constants";
import mutationDeleteOneCalendarEventByBookingId from "../graphql/MutationDeleteOneCalendarEventById";
import { calculateVariantPrice } from "../services/BookingService";
import Notes from "@molecules/notes";
import SettingsComponent from "@molecules/settings";

// @styles
import "./EditBookingModal.scss";

const EditBookingModal = ({
  currentElement,
  allClasses,
  allCoordinators,
  editMode,
  handleClose,
  handleModal,
  open,
  onEditCompleted,
  allInstructors
}) => {
  const [active, setActive] = useState("1");
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
  const [processing, setProcessing] = useState(false);
  const [isCapRegistration, setIsCapRegistration] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [distributorId, setDistributorId] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [instructorTeamMember, setInstructorTeamMember] = useState(null);
  const [upgrades, setUpgrades] = useState([]);
  const [classUpgrades, setClassUpgrades] = useState([]);
  const [isOpenBookingRequested, setIsOpenBookingRequested] = useState(false);
  const [removeCampaignRequestQuote] = useMutation(removeCampaignRequestQuoteMutation, {});
  const [updateBooking] = useMutation(mutationUpdateBooking, {});
  const [updateCalendarEventStatus] = useMutation(mutationUpdateCalendarEventByBookindId, {});
  const [deleteCalendarEventByBookingId] = useMutation(mutationDeleteOneCalendarEventByBookingId, {});
  const [updateOpenBooking] = useMutation(mutationOpenBooking, {});
  const [updateCloseBooking] = useMutation(mutationCloseBooking, {});
  const [hasInternationalAttendees, setHasInternationalAttendees] = useState(false);

  useQuery(QueryInstructorTeamMemberById, {
    fetchPolicy: "cache-and-network",
    variables: {
      instructorTeamMemberId: currentElement?.instructorTeamMemberId
    },
    onCompleted: (data) => {
      if (data?.instructorTeamMember) {
        setInstructorTeamMember(data.instructorTeamMember);
      }
    }
  });

  useQuery(QueryInstructorById, {
    fetchPolicy: "cache-and-network",
    variables: {
      instructorId: currentElement?.instructorId
    },
    onCompleted: (data) => {
      if (data?.instructor) {
        setInstructor(data?.instructor);
      }
    }
  });

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
    setIsCapRegistration(currentElement.capRegistration || false);
    setCalendarEvent(currentElement.calendarEvent);
    setClassVariantsOptions(filteredClass?.variants);
    setDistributorId(currentElement?.distributorId);
    setIsOpenBookingRequested(false);
    setInstructorAndAdditionals(
      teamClass?.additionalInstructors ? [...teamClass?.additionalInstructors, teamClass?.instructorId] : [teamClass?.instructorId]
      );
    if (currentElement.classVariant?.groupEvent) {
      setSelectedVariant(currentElement.classVariant.order);
    }
    setUpgrades(currentElement?.addons || []);
    setClassUpgrades(filteredClass?.addons || []);
    setHasInternationalAttendees(currentElement?.hasInternationalAttendees || false);
  }, [currentElement]);

  const emailValidation = (email) => {
    setEmailValid(isValidEmail(email));
  };

  const options = { phone: true, phoneRegionCode: "US" };

  const cancel = () => {
    setClosedBookingReason(null);
    setInstructorTeamMember(null);
    handleModal({});
  };

  const groupSizeValidation = (size) => {
    setAttendeesValid(size > 0);
  };

  const getStatusToReOpenBooking = () => {
    const currentPayments = currentElement.payments;

    if (currentPayments && currentPayments.length > 0) {
      const depositPayment =
        currentPayments && currentPayments.find((element) => element.paymentName === "deposit" && element.status === "succeeded");
      const finalPayment = currentPayments && currentPayments.find((element) => element.paymentName === "final" && element.status === "succeeded");
      if (finalPayment) {
        return BOOKING_PAID_STATUS;
      } else if (depositPayment) {
        return BOOKING_DEPOSIT_CONFIRMATION_STATUS;
      }
    }

    return BOOKING_QUOTE_STATUS;
  };

  const closeBooking = async () => {
    setProcessing(true);
    const teamClass = allClasses.find((element) => element._id === bookingTeamClassId);
    try {
      const resultCloseBooking = await updateCloseBooking({
        variables: {
          bookingId: currentElement._id,
          date: new Date(),
          teamClassId: bookingTeamClassId,
          classVariant,
          addons: upgrades,
          instructorId,
          instructorName,
          customerId: currentElement.customerId,
          customerName,
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
          status: "closed",
          email: customerEmail,
          phone: customerPhone,
          company: customerCompany,
          signUpDeadline: bookingSignUpDeadline && bookingSignUpDeadline.length > 0 ? bookingSignUpDeadline[0] : undefined,
          closedReason: closedBookingReason,
          notes: bookingNotes,
          capRegistration: isCapRegistration,
          distributorId,
          distributorId_unset: distributorId || distributorId === "" ? false : true,
          hasInternationalAttendees
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
        console.log("Remove campaign before redirecting:", resultEmail);
      }

      if (
        closedBookingReason === "Lost" ||
        closedBookingReason === "Duplicated" ||
        closedBookingReason === "Mistake" ||
        closedBookingReason === "Test"
      ) {
        if (calendarEvent) {
          const resultStatusUpdated = await updateCalendarEventStatus({
            variables: {
              calendarEventId: calendarEvent._id,
              status: DATE_AND_TIME_CANCELED_STATUS
            }
          });
          console.log("Changing calendar event status", resultStatusUpdated);
        }
      }

      onEditCompleted(currentElement._id);
    } catch (ex) {
      console.log("err", ex);
    }
    setProcessing(false);
    handleModal();
  };

  const openBooking = async () => {
    setProcessing(true);

    const bookingVariant = {...classVariant};

    if (!bookingVariant.groupEvent && currentElement.status !== BOOKING_PAID_STATUS && (currentElement.classVariant.title !== bookingVariant.title || currentElement.attendees !== groupSize)) {
      const byPersonPrices = calculateVariantPrice(bookingVariant, groupSize);
      bookingVariant.pricePerson = byPersonPrices.price;
    }

    try {
      const reOpenBookingStatus = getStatusToReOpenBooking();
      const resultUpdateBooking = await updateOpenBooking({
        variables: {
          bookingId: currentElement._id,
          updatedAt: new Date(),
          status: reOpenBookingStatus,
          teamClassId: bookingTeamClassId,
          instructorId,
          instructorName,
          distributorId,
          distributorId_unset: distributorId || distributorId === "" ? false : true,
          attendees: groupSize,
          addons: upgrades,
          closedReason_unset: true,
          classVariant: bookingVariant,
          eventDurationHours: bookingVariant.duration ? bookingVariant.duration : currentElement.eventDurationHours,
          classMinimum: bookingVariant.minimum,
          pricePerson: bookingVariant.pricePerson
        }
      });

      if (!resultUpdateBooking || !resultUpdateBooking.data) {
        setProcessing(false);
        return;
      }

      if (reOpenBookingStatus === BOOKING_QUOTE_STATUS) {
        await deleteCalendarEventByBookingId({
          variables: {
            bookingId: currentElement._id
          }
        });
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

      const bookingVariant = {...classVariant};

      if (!bookingVariant.groupEvent && currentElement.status !== BOOKING_PAID_STATUS && (currentElement.classVariant.title !== bookingVariant.title || currentElement.attendees !== groupSize)) {
        const byPersonPrices = calculateVariantPrice(bookingVariant, groupSize);
        bookingVariant.pricePerson = byPersonPrices.price;
      }

      const resultUpdateBooking = await updateBooking({
        variables: {
          bookingId: currentElement._id,
          date: new Date(),
          teamClassId: bookingTeamClassId,
          classVariant: bookingVariant,
          addons: upgrades,
          instructorId,
          instructorName,
          customerId: currentElement.customerId,
          customerName,
          eventDate: new Date(),
          eventDurationHours: bookingVariant.duration ? bookingVariant.duration : currentElement.eventDurationHours,
          eventCoordinatorId: coordinatorId,
          attendees: groupSize,
          classMinimum: bookingVariant.minimum,
          pricePerson: bookingVariant.pricePerson,
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
          distributorId,
          distributorId_unset: distributorId || distributorId === "" ? false : true,
          hasInternationalAttendees
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

  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
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
      borderBottom: "1px dotted",
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
      borderBottom: "1px dotted",
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

  return (
    <Modal
      isOpen={open}
      className="sidebar-sm"
      modalClassName="modal-slide-in"
      contentClassName="pt-0"
      onClosed={() => {
        handleClose();
        setDistributorId(null);
      }}
    >
      <ModalHeader toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">Edit Booking</h5>
      </ModalHeader>
      <Nav tabs className="d-flex justify-content-around mt-1">
        <NavItem>
          <NavLink
            title="Basic information"
            active={active === "1"}
            onClick={() => {
              toggle("1");
            }}
          >
            <Info size="18" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            title="Settings"
            active={active === "2"}
            onClick={() => {
              toggle("2");
            }}
          >
            <Settings size="18" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink title="Team member" active={active === "3"} onClick={() => toggle("3")}>
            <Users size="18" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink title="Notes" active={active === "4"} onClick={() => toggle("4")}>
            <MessageSquare size="18" />
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-5" activeTab={active} color="primary">
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
                  disabled={currentElement.status === BOOKING_CLOSED_STATUS}
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
                  disabled={currentElement.status === BOOKING_CLOSED_STATUS}
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
                  disabled={currentElement.status === BOOKING_CLOSED_STATUS}
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
                  disabled={currentElement.status === BOOKING_CLOSED_STATUS}
                  placeholder="Company"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            {!(currentElement.status === BOOKING_CLOSED_STATUS) && (
              <>
                <FormGroup>
                  <Label>Event Instructor*</Label>
                  <Select
                    theme={selectThemeColors}
                    styles={selectStyles}
                    isDisabled={currentElement.status === BOOKING_CLOSED_STATUS}
                    className="react-select edit-booking-select-instructor"
                    classNamePrefix="select"
                    placeholder="Select..."
                    value={{
                      label: instructorName,
                      value: instructorId
                    }}
                    options={
                      allInstructors &&
                      allInstructors
                        .filter((instructor) => instructorAndAdditionals?.includes(instructor._id))
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
                    isDisabled={currentElement.status === BOOKING_CLOSED_STATUS}
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
              </>
            )}
            <FormGroup>
              <Label for="full-name">Event Details*</Label>
              <Select
                styles={selectStyles}
                isDisabled={
                  (currentElement.status === BOOKING_CLOSED_STATUS ||
                    currentElement.status !== BOOKING_QUOTE_STATUS)
                  && !isOpenBookingRequested}
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
                  value: bookingTeamClassId || "",
                  label: bookingTeamClassName
                }}
                onChange={(option) => {
                  const filteredClass = allClasses.find((element) => element._id === option.value);
                  if (filteredClass) setDistributorId(filteredClass?.distributorId);
                  setClassVariantsOptions(filteredClass.variants);
                  setClassVariant(null);
                  setClassUpgrades(filteredClass?.addons || []);
                  setUpgrades([]);
                  setSelectedVariant(option?.value?.order);
                  setBookingTeamClassId(option.value);
                  setBookingTeamClassName(option.label);
                }}
                isClearable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label for="full-name mb-2">Upgrades</Label>
              <Select
                 theme={selectThemeColors}
                 className="react-select edit-booking-select-upgrade"
                 classNamePrefix="select"
                 placeholder="Select upgrades"
                 value={
                  upgrades && upgrades.map(upgrade => (
                    { value: upgrade, label: `${upgrade.name} (by ${upgrade.unit})`}
                  ))
                 }
                 isMulti
                 closeMenuOnSelect={false}
                 styles={selectStylesTags}
                 options={
                  classUpgrades && classUpgrades.map(upgrade => {
                    if (upgrade.active) {
                      return (
                        { value: upgrade, label: `${upgrade.name} (by ${upgrade.unit})` }
                      );
                    }
                 })
                }
                 onChange={(upgrade) => { setUpgrades(upgrade.map(({value}) => value)); } }
              />
            </FormGroup>
            <FormGroup>
              <Label for="full-name">Class Variant*</Label>
              <Select
                theme={selectThemeColors}
                isDisabled={currentElement.status === BOOKING_CLOSED_STATUS && !isOpenBookingRequested}
                styles={selectStyles}
                className="react-select edit-booking-select-variant"
                classNamePrefix="select"
                placeholder="Select..."
                value={
                  classVariant
                    ? {
                        value: classVariant,
                        label: classVariant.groupEvent
                          ? `${classVariant.title} /group`
                          : `${classVariant.title} /person`
                      }
                    : null
                }
                options={
                  classVariantsOptions &&
                  classVariantsOptions.map((element, index) => {
                    const variant = {
                      title: element.title,
                      notes: element.notes,
                      minimum: element.minimum,
                      duration: element.duration,
                      pricePerson: element.pricePerson,
                      pricePersonInstructor: element.pricePersonInstructor,
                      expectedProfit: element.expectedProfit,
                      hasKit: element.hasKit,
                      order: index,
                      active: element.active,
                      groupEvent: element.groupEvent,
                      instructorFlatFee: element.instructorFlatFee,
                      registrationFields: element.registrationFields
                    };
                    return {
                      value: variant,
                      label: element.groupEvent
                        ? `${element.title} /group`
                        : `${element.title} /person`
                    };
                  })
                }
                onChange={(option) => {
                  setSelectedVariant(option?.value?.order);
                  setClassVariant(option.value);
                  setGroupSize("");
                }}
                isClearable={false}
              />
            </FormGroup>
            {classVariant?.groupEvent ? (
              <FormGroup className="mt-1">
                <Label for="full-name">Group Size*</Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select edit-booking-select-size"
                  classNamePrefix="select"
                  placeholder="Select..."
                  isDisabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                  value={
                    classVariant.pricePerson
                      ? {
                          value: classVariant,
                          label: `${classVariant.minimum} - ${classVariant.maximum} attendees / $ ${classVariant.pricePerson}`
                        }
                      : null
                  }
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
                        pricePersonInstructor: item.priceInstructor,
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
                    disabled={currentElement.status === BOOKING_CLOSED_STATUS && !isOpenBookingRequested}
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
            {!(currentElement.status === BOOKING_CLOSED_STATUS) && (
              <>
                <FormGroup>
                  <CustomInput
                    type="switch"
                    className="edit-booking-switch"
                    id="internationalAttendeeSwitch"
                    name="internationalAttendeeSwitch"
                    label="International attendees?"
                    disabled={currentElement.status === BOOKING_CLOSED_STATUS ? true : false}
                    inline
                    value={hasInternationalAttendees}
                    checked={hasInternationalAttendees}
                    onChange={(e) => {
                      setHasInternationalAttendees(!hasInternationalAttendees);
                    }}
                  />
                </FormGroup>
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
              </>
            )}
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

            {isOpenBookingRequested && (
              <Alert color="danger">
                <p className="mx-1">
                  Please confirm event details and class variant.
                </p>
              </Alert>
            )}

            {editMode && (
              <div align="center">
                <Button
                  className="mr-1"
                  size="sm"
                  color={closedBookingReason ? "danger" : "primary"}
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
                    ? "Save"
                    : closedBookingReason && processing
                    ? "Saving..."
                    : processing
                    ? "Saving..."
                    : "Close booking?"}
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
                  color={(isOpenBookingRequested || processing) ? "primary" : "danger"}
                  onClick={() => {
                    if (!isOpenBookingRequested && BOOKING_QUOTE_STATUS === getStatusToReOpenBooking()) {
                      setIsOpenBookingRequested(true);
                      setBookingTeamClassId(null);
                      setBookingTeamClassName(null);
                      setClassVariant(null);
                      setUpgrades([]);
                      setGroupSize("");
                    } else {
                      openBooking();
                      setIsOpenBookingRequested(false);
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
                  {processing ? "Opening..." : isOpenBookingRequested ? "Save" : "Back to open status"}
                </Button>
                <Button color="secondary" size="sm" onClick={cancel} outline>
                  Cancel
                </Button>
              </div>
            )}
          </ModalBody>
        </TabPane>
        <TabPane tabId="3" className="px-2">
          <FormGroup>
            <Label for="full-name">
              <strong>Id:</strong> <span className="text-primary">{`${currentElement?._id}`}</span>
            </Label>
          </FormGroup>
          <FormGroup>
            <Label className="">Instructor in charge of this class</Label>
          </FormGroup>
          <FormGroup>
            <InputGroup size="sm">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <User size={15} />
                </InputGroupText>
              </InputGroupAddon>
              <Input id="full-name" placeholder="Full Name *" value={instructorTeamMember?.name || instructor?.name} disabled />
            </InputGroup>
            <InputGroup size="sm" className="mt-2">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <Mail size={15} />
                </InputGroupText>
              </InputGroupAddon>
              <Input type="email" id="email" placeholder="Email *" value={instructorTeamMember?.email || instructor?.email} disabled />
            </InputGroup>
            <InputGroup size="sm" className="mt-2">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <Phone size={15} />
                </InputGroupText>
              </InputGroupAddon>
              <Input type="phone" id="phone" placeholder="Phone" value={instructorTeamMember?.phone || instructor?.phone} disabled />
            </InputGroup>
          </FormGroup>
        </TabPane>
        <TabPane tabId="4">
          <Notes bookingNotes={bookingNotes} setBookingNotes={setBookingNotes} currentElement={currentElement}></Notes>
        </TabPane>
        <TabPane tabId="2">
          <SettingsComponent
            currentElement={currentElement}
            editMode={editMode}
            closedBookingReason={closedBookingReason}
            cancel={cancel}
            onEditCompleted={onEditCompleted}
          />
        </TabPane>
      </TabContent>
    </Modal>
  );
};

export default EditBookingModal;
