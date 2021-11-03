import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Card, CardBody, CardHeader, CardFooter, Button, Media, CardLink, Badge } from 'reactstrap'
import { Calendar, Edit2, Repeat, User, Users, Check, DollarSign, Mail, Phone, Edit } from 'react-feather'
import { capitalizeString, getBookingTotals, toAmPm } from '../../../../utility/Utils'
import './BoardCard.scss'
import Avatar from '@components/avatar'

function BoardCard({
  handleEditModal,
  content: {
    customerName,
    _id,
    attendees,
    classVariant,
    teamClassId,
    createdAt,
    updatedAt,
    status,
    classTitle,
    scheduled,
    eventDurationHours,
    email,
    phone,
    company,
    serviceFee,
    pricePerson,
    minimum,
    salesTax,
    additionals,
    calendarEvent,
    teamClass,
    customerId,
    coordinatorName,
    payments,
    eventCoordinatorId,
    signUpDeadline,
    closedReason,
    notes
  }
}) {
  const [flippedCard, setFlippedCard] = useState(false)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [total, setTotal] = useState(0)
  const [showFinalPaymentLabel, setShowFinalPaymentLabel] = useState(null)

  const getTotals = () => {
    const bookingInfo = {
      classVariant,
      classMinimum: minimum,
      pricePerson,
      serviceFee,
      payments,
      attendees,
      salesTax
    }

    const bookingTotals = getBookingTotals(bookingInfo, false, salesTax, true)
    setTotal(bookingTotals.finalValue.toFixed(2))
  }

  useEffect(() => {
    getTotals()
  }, [classVariant])

  useEffect(() => {
    const depositPayment = payments && payments.find((element) => element.paymentName === 'deposit' && element.status === 'succeeded')
    const finalPayment = payments && payments.find((element) => element.paymentName === 'final' && element.status === 'succeeded')

    if (depositPayment || finalPayment) {
      setShowFinalPaymentLabel(finalPayment ? 'success' : 'danger')
    }
  }, [payments])

  const formatTime = () => toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, 'CT')

  useEffect(() => {
    setDate(calendarEvent ? new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day) : null)
    setTime(calendarEvent ? formatTime() : null)
  }, [calendarEvent, teamClass])

  const cardBack = () => {
    return (
      <div>
        <div>
          <p className="mb-1 p-0">
            <strong>{capitalizeString(customerName)}</strong>
            <br />
            <small>
              <Mail size={12} /> {email}
            </small>
            <br />
            <small>
              <Phone size={12} /> {phone}
            </small>
          </p>

          <p className="small">
            <strong>ID:</strong> {_id}
          </p>
          <p className="small text-primary">{classTitle}</p>
        </div>
        {date && time && (
          <Media className="pb-1">
            <Avatar color="light-primary" className="rounded mr-1" icon={<Calendar size={18} />} />
            <Media body>
              <h6 className="mb-0">{` ${moment(date).format('LL')}`}</h6>
              <small>{time}</small>
            </Media>
          </Media>
        )}
        {(!date || !time) && (
          <Media className="pb-1">
            <Media body>
              <h6 className="mb-0">
                <Avatar color="light-primary" className="rounded mr-1" icon={<Calendar size={18} />} /> TBD
              </h6>
            </Media>
          </Media>
        )}
        <div className="text-block pb-0">
          <table className="w-100">
            <tbody>
              <tr>
                <th className="font-weight-normal small">Attendees</th>
                <td className="text-right small align-top">{attendees}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small">Option</th>
                <td className="text-right small">{classVariant && classVariant.title}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small">Total</th>
                <td className="text-right small align-top">~ ${total}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small pt-2">Created</th>
                <td className="text-right small pt-2">{` ${moment(createdAt).format('LL')}`}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small">Updated</th>
                <td className="text-right small">{` ${moment(updatedAt).format('LL')}`}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th className="pt-1 small">Coordinator</th>
                <td className="font-weight-bold small text-right pt-1">{coordinatorName}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    )
  }

  const cardFront = () => {
    return (
      <>
        <p className="text-truncate m-0 p-0">
          <strong>{capitalizeString(customerName && customerName.split(' ')[0])}</strong>
          <span className="text-primary small">{` ~ $${total}`}</span>
          <br />
          <small className="text-xs">{classTitle}</small>
        </p>

        <p className="m-0 p-0">
          <small className="">
            <strong>Updated: </strong>
            {moment(updatedAt).fromNow()}
          </small>
        </p>
      </>
    )
  }

  return (
    <>
      <Card className="card-board">
        <CardHeader className="p-0 m-0">
          <Button
            color="link"
            className="flip-button text-muted"
            onClick={() => {
              setFlippedCard(!flippedCard)
            }}
          >
            <Repeat size={14} />
          </Button>
        </CardHeader>
        <CardBody
          className="p-1 cursor-pointer"
          onClick={() =>
            handleEditModal({
              bookingId: _id,
              currentCustomerId: customerId,
              currentName: customerName,
              currentEmail: email,
              currentPhone: phone,
              currentCompany: company,
              currentCoordinatorId: eventCoordinatorId,
              currentCoordinatorName: coordinatorName,
              currentTeamclassId: teamClassId,
              currentTeamclassName: classTitle,
              currentGroupSize: attendees,
              currentSignUpDeadline: signUpDeadline,
              currentClassVariant: classVariant,
              currentServiceFee: serviceFee,
              currentSalesTax: salesTax,
              createdAt: createdAt,
              updatedAt: updatedAt,
              currentStatus: status,
              currentEventDurationHours: eventDurationHours,
              currentClosedReason: closedReason,
              currentNotes: notes
            })
          }
          title={'Edit booking info'}
        >
          {flippedCard ? cardBack() : cardFront()}
        </CardBody>
        <CardFooter className="card-board-footer pr-1">
          {status === 'quote' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/booking/select-date-time/${_id}`} target={'_blank'} title={'Select date and time link'}>
                <Avatar color="light-primary" size="sm" icon={<Calendar size={18} />} />
              </CardLink>
              <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status === 'date-requested' && calendarEvent && calendarEvent.status === 'reserved' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/booking/date-time-confirmation/${_id}`} target={'_blank'} title={'Approve/Reject link'}>
                <Avatar color="light-primary" size="sm" icon={<Check size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status === 'date-requested' && calendarEvent && calendarEvent.status === 'confirmed' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/booking/date-time-confirmation/${_id}`} target={'_blank'} title={'Approve/Reject link'}>
                <Avatar color="light-primary" size="sm" icon={<Check size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status === 'date-requested' && calendarEvent && calendarEvent.status === 'rejected' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/booking/date-time-confirmation/${_id}`} target={'_blank'} title={'Approve/Reject link'}>
                <Avatar color="light-primary" size="sm" icon={<Check size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status === 'confirmed' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/payment/${_id}`} target={'_blank'} title={'Final payment link'}>
                <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status === 'paid' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/payment/${_id}`} target={'_blank'} title={'Final payment link'}>
                <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status !== 'canceled' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/payment/${_id}`} target={'_blank'} title={'Final payment link'}>
                <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : (
            <></>
          )}
        </CardFooter>

        {showFinalPaymentLabel && (
          <CardFooter className="card-board-footer pr-1">
            <Badge size="sm" color={`light-${showFinalPaymentLabel}`} pill>
              Final Payment
            </Badge>
          </CardFooter>
        )}
      </Card>
    </>
  )
}

export default BoardCard
