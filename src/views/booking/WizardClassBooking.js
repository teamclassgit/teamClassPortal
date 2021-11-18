// @packages
import React, { useRef, useState, useEffect } from 'react';
import Wizard from '@components/wizard';
import moment from 'moment';
import { Calendar, CreditCard, Users, DollarSign } from 'react-feather';
import { Col, Row, Spinner } from 'reactstrap';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

// @scripts
import Attendees from './steps/Attendees';
import BillingInfo from './steps/BillingInfo';
import BookingCheckoutSummary from './steps/BookingCheckoutSummary';
import Confirmation from './steps/Confirmation';
import DateTimeConfirmation from './steps/DateTimeConfirmation';
import InvoiceBuilder from './steps/InvoiceBuilder';
import Payments from './steps/Payments';
import queryAttendeesByBookingId from '../../graphql/QueryAttendeesByBookingId';
import queryBookingById from '../../graphql/QueryBookingById';
import queryCalendarEventsByClassId from '../../graphql/QueryCalendarEventsByClassId';
import queryClassById from '../../graphql/QueryClassById';
import queryCustomerById from '../../graphql/QueryCustomerById';
import { RUSH_FEE } from '../../utility/Constants';
import { getBookingTotals } from '../../utility/Utils';

const WizardClassBooking = () => {
  const [attendees, setAttendees] = useState([]);
  const [attendeesToInvoice, setAttendeesToInvoice] = useState(null);
  const [availableEvents, setAvailableEvents] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [calendarEvent, setCalendarEvent] = useState(null);
  const [confirmation, setConfirmation] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [initialDeposit, setInitialDeposit] = useState(0);
  const [payment, setPayment] = useState(0);
  const [realCountAttendees, setRealCountAttendees] = useState(0);
  const [requestEventDate, setRequestEventDate] = useState(null);
  const [stepper, setStepper] = useState(null);
  const [tax, setTax] = useState(0);
  const [teamClass, setTeamClass] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalAddons, setTotalAddons] = useState(0);
  const [totalCardFee, setTotalCardFee] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalRushFee, setTotalTotalRushFee] = useState(0);
  const [totalServiceFee, setTotalServiceFee] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalUnderGroupFee, setTotalUnderGroupFee] = useState(0);
  const [totalWithoutFee, setTotalWithoutFee] = useState(0);

  const [getTeamClass, { ...classResult }] = useLazyQuery(queryClassById);
  const [getCustomer, { ...customerResult }] = useLazyQuery(queryCustomerById);
  const [getClassEvents, { ...calendarEventsByClassResult }] = useLazyQuery(queryCalendarEventsByClassId);
  const [getAttendees, { ...attendeesResult }] = useLazyQuery(queryAttendeesByBookingId);

  const ref = useRef(null);
  const { id } = useParams();

  const result = useQuery(queryBookingById, {
    variables: {
      bookingId: id
    },
    pollInterval: 300000,
    onCompleted: (data) => {
      setBookingInfo(data.booking);
      setTax((data.booking && data.booking.salesTax) || 0);
    }
  });

  useEffect(() => {
    if (bookingInfo && attendeesResult.data) {
      setAttendees(attendeesResult.data.attendees.map((element) => element));
      setRealCountAttendees(attendeesResult.data.attendees.length);
    }
  }, [attendeesResult.data]);

  useEffect(() => {
    if (bookingInfo && classResult.data) setTeamClass(classResult.data.teamClass);
  }, [classResult.data]);

  useEffect(() => {
    if (bookingInfo && customerResult.data) setCustomer(customerResult.data.customer);
  }, [customerResult.data]);

  useEffect(() => {
    if (bookingInfo && calendarEventsByClassResult.data) {
      setAvailableEvents(calendarEventsByClassResult.data.calendarEvents.map((element) => element));
      const bookingEvent = calendarEventsByClassResult.data.calendarEvents.filter((element) => element.bookingId === bookingInfo._id);

      if (bookingEvent && bookingEvent.length > 0) setCalendarEvent(bookingEvent[0]);
    }
  }, [calendarEventsByClassResult.data]);

  useEffect(() => {
    if (calendarEvent) {
      const eventDate = [new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day)];
      const eventTime = `${calendarEvent.fromHour}:${calendarEvent.fromMinutes === 0 ? '00' : calendarEvent.fromMinutes}`;
      const eventNewDate = moment(`${moment(eventDate[0]).format('DD/MM/YYYY')} ${eventTime}`, 'DD/MM/YYYY HH:mm');

      const newCalendarEventOption = {
        dateOption: eventDate[0],
        timeOption: eventTime,
        fullEventDate: eventNewDate.valueOf()
      };

      setRequestEventDate(newCalendarEventOption);
    }
  }, [calendarEvent]);

  const getTotals = () => {
    if (!bookingInfo) return;

    const bookingTotals = getBookingTotals(bookingInfo, false, tax, true);

    setTotalTax(bookingTotals.tax.toFixed(2));
    setTotalWithoutFee(bookingTotals.withoutFee.toFixed(2));
    setTotalServiceFee(bookingTotals.fee.toFixed(2));
    setTotalTotalRushFee(bookingTotals.rushFee.toFixed(2));
    setTotalUnderGroupFee(bookingTotals.underGroupFee.toFixed(2));
    setTotal(bookingTotals.finalValue.toFixed(2));
    setTotalAddons(bookingTotals.addons.toFixed(2));
    setTotalCardFee(bookingTotals.cardFee.toFixed(2));
    setAttendeesToInvoice(bookingTotals.customAttendees);
    setDiscount(bookingTotals.discount * 100);
    setTotalDiscount(bookingTotals.totalDiscount.toFixed(2));

    const depositsPaid =
      bookingInfo &&
      bookingInfo.payments &&
      bookingInfo.payments.filter((element) => element.paymentName === 'deposit' && element.status === 'succeeded');

    const initialDepositPaid = !isNaN(bookingTotals.customDeposit)
      ? bookingTotals.customDeposit
      : depositsPaid && depositsPaid.length > 0
        ? depositsPaid.reduce((previous, current) => previous + current.amount, 0) / 100
        : 0;

    const finalPayment = bookingTotals.finalValue - initialDepositPaid;
    setInitialDeposit(initialDepositPaid.toFixed(2));
    setPayment(finalPayment.toFixed(2));
  };

  useEffect(() => {
    if (bookingInfo) {
      getAttendees({
        variables: {
          bookingId: bookingInfo._id
        }
      });

      getTeamClass({
        variables: {
          classId: bookingInfo.teamClassId
        }
      });
      getCustomer({
        variables: {
          customerId: bookingInfo.customerId
        }
      });
      getClassEvents({
        variables: {
          classId: bookingInfo.teamClassId
        }
      });

      getTotals();
    }
  }, [bookingInfo]);

  
  const steps = [
    {
      id: 'account-details',
      title: 'Event Date',
      subtitle: 'Date and time',
      icon: <Calendar size={18} />,
      content: (
        <DateTimeConfirmation
          classRushFee={RUSH_FEE}
          stepper={stepper}
          type="wizard-horizontal"
          availableEvents={availableEvents}
          calendarEvent={calendarEvent}
          setCalendarEvent={setCalendarEvent}
          booking={bookingInfo}
          teamClass={teamClass}
        />
      )
    },

    {
      id: 'step-address',
      title: 'Attendees',
      subtitle: 'Who is coming',
      icon: <Users size={18} />,
      content: (
        <Attendees
          stepper={stepper}
          type="wizard-horizontal"
          attendees={attendees}
          teamClass={teamClass}
          booking={bookingInfo}
          setRealCountAttendees={setRealCountAttendees}
        />
      )
    },

    {
      id: 'personal-info',
      title: 'Customer',
      subtitle: 'Basic info',
      icon: <CreditCard size={18} />,
      content: <BillingInfo type="wizard-horizontal" calendarEvent={calendarEvent} customer={customer} booking={bookingInfo} />
    },

    {
      id: 'payments',
      title: 'Payments',
      subtitle: 'Received payments',
      icon: <DollarSign size={18} />,
      content: (
        <Payments
          stepper={stepper}
          type="wizard-horizontal"
          booking={bookingInfo}
          setBooking={setBookingInfo}
          teamClass={teamClass}
          realCountAttendees={realCountAttendees}
        ></Payments>
      )
    },

    {
      id: 'final-invoice',
      title: 'Final Invoice',
      subtitle: 'Final invoice details',
      icon: <DollarSign size={18} />,
      content: (
        <InvoiceBuilder
          stepper={stepper}
          type="wizard-horizontal"
          booking={bookingInfo}
          setBooking={setBookingInfo}
          teamClass={teamClass}
          realCountAttendees={realCountAttendees}
        ></InvoiceBuilder>
      )
    }
  ];

  const stepsConfirmation = [
    {
      id: 'confirmation',
      content: <Confirmation stepper={stepper} type="wizard-horizontal" customer={customer} booking={bookingInfo} setConfirmation={setConfirmation} />
    }
  ];

  return bookingInfo && customer && teamClass ? (
    <Row>
      <Col lg={9} md={12} sm={12}>
        <div className="modern-horizontal-wizard">
          {!confirmation && (
            <Wizard
              type="modern-horizontal"
              ref={ref}
              steps={steps}
              options={{
                linear: false
              }}
              instance={(el) => {
                setStepper(el);
              }}
            />
          )}
          {confirmation && (
            <Wizard
              type="modern-horizontal"
              ref={ref}
              steps={stepsConfirmation}
              options={{
                linear: false
              }}
              instance={(el) => {
                setStepper(el);
              }}
            />
          )}
        </div>
      </Col>

      <Col lg={3} md={12} sm={12}>
        <div>
          {bookingInfo && (
            <BookingCheckoutSummary
              teamClass={teamClass}
              bookingInfo={bookingInfo}
              requestEventDate={requestEventDate}
              calendarEvent={calendarEvent}
              totalWithoutFee={totalWithoutFee}
              totalAddons={totalAddons}
              totalServiceFee={totalServiceFee}
              totalCardFee={totalCardFee}
              tax={tax}
              totalTax={totalTax}
              total={total}
              discount={discount}
              totalDiscount={totalDiscount}
              deposit={initialDeposit}
              showFinalPaymentLine={true}
              finalPayment={payment}
              attendeesToInvoice={attendeesToInvoice || bookingInfo.attendees}
            />
          )}
        </div>
      </Col>
    </Row>
  ) : (
    <div>
      <Spinner className="mr-25" />
      <Spinner type="grow" />
    </div>
  );
};

export default WizardClassBooking;
