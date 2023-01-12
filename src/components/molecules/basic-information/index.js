// @packages
import React, { useEffect, useState } from "react";
import { Briefcase, Mail, Phone, User } from "react-feather";
import { Alert, Button, CustomInput, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, ModalBody } from "reactstrap";
import PropTypes from "prop-types";
import Select from "react-select";
import validator from "validator";
import { useMutation } from "@apollo/client";
import Cleave from "cleave.js/react";
import Flatpickr from "react-flatpickr";

// @scripts
import { BOOKING_CLOSED_STATUS, BOOKING_DEPOSIT_CONFIRMATION_STATUS, BOOKING_PAID_STATUS, BOOKING_QUOTE_STATUS, DATE_AND_TIME_CANCELED_STATUS } from "@utility/Constants";
import { selectThemeColors } from "@utils";
import mutationUpdateBooking from "@graphql/MutationUpdateBookingAndCustomer";
import mutationOpenBooking from "@graphql/MutationOpenBooking";
import mutationCloseBooking from "@graphql/MutationCloseBooking";
import mutationUpdateCalendarEventByBookindId from "@graphql/MutationUpdateCalendarEventByBookindId";
import removeCampaignRequestQuoteMutation from "@graphql/email/removeCampaignRequestQuote";
import closeBookingOptions from "@data/closed-booking-options.json";
import { calculateVariantPrice } from "@services/BookingService";
import mutationDeleteOneCalendarEventByBookingId from "@graphql/MutationDeleteOneCalendarEventById";

const BasicInformation = ({currentElement, allInstructors, allClasses, allCoordinators, editMode, closedBookingReason, setClosedBookingReason, calendarEvent, closeModal, onEditCompleted}) => {

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    isEmailValid: true
  });
  const [instructorId, setInstructorId] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [instructorAndAdditionals, setInstructorAndAdditionals] = useState([]);
  const [coordinatorId, setCoordinatorId] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [isOpenBookingRequested, setIsOpenBookingRequested] = useState(false);
  const [bookingTeamClassId, setBookingTeamClassId] = useState("");
  const [bookingTeamClassName, setBookingTeamClassName] = useState("");
  const [distributorId, setDistributorId] = useState("");
  const [upgrades, setUpgrades] = useState([]);
  const [classUpgrades, setClassUpgrades] = useState([]);
  const [classVariant, setClassVariant] = useState({});
  const [classVariantsOptions, setClassVariantsOptions] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [groupSize, setGroupSize] = useState(0);
  const [attendeesValid, setAttendeesValid] = useState(true);
  const [hasInternationalAttendees, setHasInternationalAttendees] = useState(false);
  const [isCapRegistration, setIsCapRegistration] = useState(false);
  const [bookingSignUpDeadline, setBookingSignUpDeadline] = useState([]);
  const [processing, setProcessing] = useState(false);

  const [updateBooking] = useMutation(mutationUpdateBooking, {});
  const [removeCampaignRequestQuote] = useMutation(removeCampaignRequestQuoteMutation, {});
  const [updateCalendarEventStatus] = useMutation(mutationUpdateCalendarEventByBookindId, {});
  const [deleteCalendarEventByBookingId] = useMutation(mutationDeleteOneCalendarEventByBookingId, {});
  const [updateOpenBooking] = useMutation(mutationOpenBooking, {});
  const [updateCloseBooking] = useMutation(mutationCloseBooking, {});

  useEffect(() => {
    if (!currentElement?._id) return;

    const teamClass = allClasses.find((element) => element._id === currentElement.teamClassId);
    const coordinator = allCoordinators.find((element) => element._id === currentElement.eventCoordinatorId);
    const instructor = allInstructors.find((element) => element._id === currentElement.instructorId);
    const customer = currentElement.customer;
    const filteredClass = allClasses.find((element) => element._id === teamClass?._id);

    setBookingSignUpDeadline([currentElement.signUpDeadline]);
    setBookingTeamClassId(teamClass._id);
    setBookingTeamClassName(teamClass.title);
    setClassVariant(currentElement.classVariant);
    setCoordinatorId(coordinator?._id);
    setCoordinatorName(coordinator?.name);
    setInstructorId(instructor?._id);
    setInstructorName(instructor?.name);
    setCustomerInfo({
      ...customerInfo,
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      company: customer?.company || ""
    });
    setGroupSize(currentElement.attendees);
    setIsCapRegistration(currentElement.capRegistration || false);
    setDistributorId(currentElement?.distributorId);
    setIsOpenBookingRequested(false);
    setInstructorAndAdditionals(
      teamClass?.additionalInstructors ? [...teamClass?.additionalInstructors, teamClass?.instructorId] : [teamClass?.instructorId]
      );
    if (currentElement.classVariant?.groupEvent) {
      setSelectedVariant(currentElement.classVariant.order);
    }
    setUpgrades(currentElement?.addons || []);
    setHasInternationalAttendees(currentElement?.hasInternationalAttendees || false);

    setClassUpgrades(filteredClass?.addons || []);
    setClassVariantsOptions(filteredClass?.variants);
  }, [currentElement]);

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

  const handleChangeCustomerInfo = (field, value) => {
    setCustomerInfo({...customerInfo, [field]: value});
  };

  const saveChangesBooking = async () => {
    setProcessing(true);

    try {
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
          customerName: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          company: customerInfo.company,
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
          signUpDeadline: bookingSignUpDeadline && bookingSignUpDeadline.length > 0 ? bookingSignUpDeadline[0] : undefined,
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
    closeModal();
  };

  const closeBooking = async () => {
    setProcessing(true);
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
          customerName: customerInfo.name,
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
          email: customerInfo.email,
          phone: customerInfo.phone,
          company: customerInfo.company,
          signUpDeadline: bookingSignUpDeadline && bookingSignUpDeadline.length > 0 ? bookingSignUpDeadline[0] : undefined,
          closedReason: closedBookingReason,
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
          variables: { customerEmail: customerInfo.email.toLowerCase() }
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
    closeModal();
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
    closeModal();
  };

  return (
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
            value={customerInfo.name}
            onChange={(e) => handleChangeCustomerInfo("name", e.target.value)}
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
            value={customerInfo.email}
            onChange={(e) => handleChangeCustomerInfo("email", e.target.value)}
            invalid={!customerInfo.isEmailValid}
            onBlur={(e) => handleChangeCustomerInfo("isEmailValid", validator.isEmail(e.target.value))}
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
            options={{ phone: true, phoneRegionCode: "US" }}
            id="phone"
            value={customerInfo.phone}
            onChange={(e) => handleChangeCustomerInfo("phone", e.target.value)}
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
            value={customerInfo.company}
            onChange={(e) => handleChangeCustomerInfo("company", e.target.value)}
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
              onBlur={(e) => setAttendeesValid(+e.target.value > 0)}
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
              !customerInfo.name ||
              !customerInfo.email ||
              !customerInfo.isEmailValid ||
              !customerInfo.phone ||
              !coordinatorId ||
              !bookingTeamClassId ||
              !classVariant ||
              !groupSize ||
              !attendeesValid
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
          <Button
            color="secondary"
            size="sm"
            onClick={closeModal}
            outline
          >
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
              !customerInfo.name ||
              !customerInfo.email ||
              !customerInfo.isEmailValid ||
              !customerInfo.phone ||
              !coordinatorId ||
              !bookingTeamClassId ||
              !classVariant ||
              !groupSize
            }
          >
            {processing ? "Opening..." : isOpenBookingRequested ? "Save" : "Back to open status"}
          </Button>
          <Button
            color="secondary"
            size="sm"
            onClick={closeModal}
            outline
          >
            Cancel
          </Button>
        </div>
      )}
    </ModalBody>
  );
};

BasicInformation.propTypes = {
  currentElement: PropTypes.object,
  allInstructors: PropTypes.array,
  allClasses: PropTypes.array,
  allCoordinators: PropTypes.array,
  editMode: PropTypes.bool,
  closedBookingReason: PropTypes.string,
  setClosedBookingReason: PropTypes.func,
  calendarEvent: PropTypes.object,
  closeModal: PropTypes.func,
  onEditCompleted: PropTypes.func
};

export default BasicInformation;
