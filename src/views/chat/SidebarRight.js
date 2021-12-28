// @packages
import classnames from 'classnames';
import React, { useState, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

// @scripts
import BookingCheckoutSummary from '../booking/steps/BookingCheckoutSummary';
import moment from 'moment';
import queryAttendeesByBookingId from '../../graphql/QueryAttendeesByBookingId';
import queryCalendarEventsByClassId from '../../graphql/QueryCalendarEventsByClassId';
import queryClassById from '../../graphql/QueryClassById';
import queryBookingById from '../../graphql/QueryBookingById';
import queryCustomerById from '../../graphql/QueryCustomerById';
import { getBookingTotals } from '../../utility/Utils';

const SidebarRight = ({
  conversation
}) => {
  const [attendees, setAttendees] = useState([]);
  const [attendeesToInvoice, setAttendeesToInvoice] = useState(null);
  const [availableEvents, setAvailableEvents] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [calendarEvent, setCalendarEvent] = useState(null);
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

  const [getAttendees, { ...attendeesResult }] = useLazyQuery(queryAttendeesByBookingId);
  const [getClassEvents, { ...calendarEventsByClassResult }] = useLazyQuery(queryCalendarEventsByClassId);
  const [getCustomer, { ...customerResult }] = useLazyQuery(queryCustomerById);
  const [getTeamClass, { ...classResult }] = useLazyQuery(queryClassById);

  const id = conversation?.channelState?.friendlyName;
  useQuery(queryBookingById, {
    variables: {
      bookingId: id
    },
    pollInterval: 300000,
    onCompleted: (data) => {
      setBookingInfo(data.booking);
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
      setTax(bookingInfo.salesTax || 0);

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

  return (
    <div className='sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('chat-profile-sidebar')}
        >
          <div style={{
            display: 'flex',
            padding: '10.5px',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '111%',
            backgroundColor: 'white',
            borderLeft: '1px solid #ebe9f1',
            borderBottom: '1px solid #ebe9f1'
          }}>
            <h4>
              Details
            </h4>
          </div>
          {bookingInfo && (
            <BookingCheckoutSummary
              teamClass={teamClass}
              chat
              changeSpace
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
      </div>
    </div>
  );
};

export default SidebarRight;
