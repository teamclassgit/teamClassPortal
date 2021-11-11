import React, { useRef, useState } from 'react'
import Wizard from '@components/wizard'
import Attendees from './steps/Attendees'
import Confirmation from './steps/Confirmation'
import BillingInfo from './steps/BillingInfo'
import InvoiceBuilder from './steps/InvoiceBuilder'
import DateTimeConfirmation from './steps/DateTimeConfirmation'
import { Col, Row, Spinner } from 'reactstrap'
import { Calendar, Check, CreditCard, Users, List, DollarSign, Settings } from 'react-feather'
import { useParams } from 'react-router-dom'
import queryBookingById from '../../graphql/QueryBookingById'
import queryClassById from '../../graphql/QueryClassById'
import queryCustomerById from '../../graphql/QueryCustomerById'
import queryAttendeesByBookingId from '../../graphql/QueryAttendeesByBookingId'
import queryCalendarEventsByClassId from '../../graphql/QueryCalendarEventsByClassId'
import { useLazyQuery, useQuery } from '@apollo/client'
import BookingCheckoutSummary from './steps/BookingCheckoutSummary'
import { RUSH_FEE } from '../../utility/Constants'
import { getBookingTotals } from '../../utility/Utils'
import moment from 'moment'

const WizardClassBooking = () => {
  const [bookingInfo, setBookingInfo] = React.useState(null)
  const [confirmation, setConfirmation] = React.useState(true)
  const [teamClass, setTeamClass] = React.useState(null)
  const [customer, setCustomer] = React.useState(null)
  const [availableEvents, setAvailableEvents] = React.useState(null)
  const [stepper, setStepper] = useState(null)
  const [calendarEvent, setCalendarEvent] = React.useState(null)
  const [attendees, setAttendees] = React.useState([])
  const [realCountAttendees, setRealCountAttendees] = React.useState(0)
  const [totalWithoutFee, setTotalWithoutFee] = React.useState(0)
  const [totalUnderGroupFee, setTotalUnderGroupFee] = React.useState(0)
  const [attendeesToInvoice, setAttendeesToInvoice] = React.useState(null)
  const [tax, setTax] = React.useState(0)
  const [totalTax, setTotalTax] = React.useState(0)
  const [discount, setDiscount] = React.useState(0)
  const [totalDiscount, setTotalDiscount] = React.useState(0)
  const [totalServiceFee, setTotalServiceFee] = React.useState(0)
  const [totalRushFee, setTotalTotalRushFee] = React.useState(0)
  const [totalCardFee, setTotalCardFee] = React.useState(0)
  const [totalAddons, setTotalAddons] = React.useState(0)
  const [total, setTotal] = React.useState(0)
  const [payment, setPayment] = React.useState(0)
  const [initialDeposit, setInitialDeposit] = React.useState(0)
  const [requestEventDate, setRequestEventDate] = React.useState(null)

  const [getTeamClass, { ...classResult }] = useLazyQuery(queryClassById)
  const [getCustomer, { ...customerResult }] = useLazyQuery(queryCustomerById)
  const [getClassEvents, { ...calendarEventsByClassResult }] = useLazyQuery(queryCalendarEventsByClassId)
  const [getAttendees, { ...attendeesResult }] = useLazyQuery(queryAttendeesByBookingId)

  const ref = useRef(null)
  const { id } = useParams()

  const result = useQuery(queryBookingById, {
    variables: {
      bookingId: id
    },
    onCompleted: (data) => {
      setBookingInfo(data.booking)
      setTax((data.booking && data.booking.salesTax) || 0)
    }
  })

  React.useEffect(() => {
    if (bookingInfo) {
      getAttendees({
        variables: {
          bookingId: bookingInfo._id
        }
      })

      getTeamClass({
        variables: {
          classId: bookingInfo.teamClassId
        }
      })
      getCustomer({
        variables: {
          customerId: bookingInfo.customerId
        }
      })
      getClassEvents({
        variables: {
          classId: bookingInfo.teamClassId
        }
      })

      getTotals()
    }
  }, [bookingInfo])

  React.useEffect(() => {
    if (bookingInfo && attendeesResult.data) {
      setAttendees(attendeesResult.data.attendees.map((element) => element))
      setRealCountAttendees(attendeesResult.data.attendees.length)
    }
  }, [attendeesResult.data])

  React.useEffect(() => {
    if (bookingInfo && classResult.data) setTeamClass(classResult.data.teamClass)
  }, [classResult.data])

  React.useEffect(() => {
    if (bookingInfo && customerResult.data) setCustomer(customerResult.data.customer)
  }, [customerResult.data])

  React.useEffect(() => {
    if (bookingInfo && calendarEventsByClassResult.data) {
      setAvailableEvents(calendarEventsByClassResult.data.calendarEvents.map((element) => element))
      const bookingEvent = calendarEventsByClassResult.data.calendarEvents.filter((element) => element.bookingId === bookingInfo._id)

      if (bookingEvent && bookingEvent.length > 0) setCalendarEvent(bookingEvent[0])
    }
  }, [calendarEventsByClassResult.data])

  React.useEffect(() => {
    if (calendarEvent) {
      const eventDate = [new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day)]
      const eventTime = `${calendarEvent.fromHour}:${calendarEvent.fromMinutes === 0 ? '00' : calendarEvent.fromMinutes}`
      const eventNewDate = moment(`${moment(eventDate[0]).format('DD/MM/YYYY')} ${eventTime}`, 'DD/MM/YYYY HH:mm')

      const newCalendarEventOption = {
        dateOption: eventDate[0],
        timeOption: eventTime,
        fullEventDate: eventNewDate.valueOf()
      }

      setRequestEventDate(newCalendarEventOption)
    }
  }, [calendarEvent])

  const getTotals = () => {
    if (!bookingInfo) return

    const bookingTotals = getBookingTotals(bookingInfo, false, tax, true)

    setTotalTax(bookingTotals.tax.toFixed(2))
    setTotalWithoutFee(bookingTotals.withoutFee.toFixed(2))
    setTotalServiceFee(bookingTotals.fee.toFixed(2))
    setTotalTotalRushFee(bookingTotals.rushFee.toFixed(2))
    setTotalUnderGroupFee(bookingTotals.underGroupFee.toFixed(2))
    setTotal(bookingTotals.finalValue.toFixed(2))
    setTotalAddons(bookingTotals.addons.toFixed(2))
    setTotalCardFee(bookingTotals.cardFee.toFixed(2))
    setAttendeesToInvoice(bookingTotals.customAttendees)
    setDiscount(bookingTotals.discount * 100)
    setTotalDiscount(bookingTotals.totalDiscount.toFixed(2))

    const depositPayment =
      bookingInfo.payments && bookingInfo.payments.find((element) => element.paymentName === 'deposit' && element.status === 'succeeded')

    const initialDepositPaid = !isNaN(bookingTotals.customDeposit) ? bookingTotals.customDeposit : depositPayment ? depositPayment.amount / 100 : 0 //amount is in cents
    const finalPayment = bookingTotals.finalValue - initialDepositPaid
    setInitialDeposit(initialDepositPaid.toFixed(2))
    setPayment(finalPayment.toFixed(2))
  }

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
      id: 'final-invoice',
      title: 'Invoice',
      subtitle: 'Final invoice',
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
  ]

  const stepsConfirmation = [
    {
      id: 'confirmation',
      title: 'Confirmation',
      subtitle: 'Booking summary',
      icon: <Check size={18} />,
      content: <Confirmation stepper={stepper} type="wizard-horizontal" customer={customer} booking={bookingInfo} setConfirmation={setConfirmation} />
    }
  ]

  const jumpToStep = (event) => {
    //if (event.detail.to === 3) event.preventDefault()
  }

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
                setStepper(el)
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
                setStepper(el)
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
  )
}

export default WizardClassBooking
