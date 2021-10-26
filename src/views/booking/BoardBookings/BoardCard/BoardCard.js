import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Card, CardBody, CardFooter, Button, Media, CardLink, FormText, Badge } from 'reactstrap'
import { Calendar, Edit2, ShoppingCart, Repeat, User, Users, Check, DollarSign, Mail } from 'react-feather'
import { capitalizeString, toAmPm } from '../../../../utility/Utils'
import './BoardCard.scss'
import Avatar from '@components/avatar'

function BoardCard({
  content: {
    customerName,
    _id,
    attendees,
    variant,
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
    coordinatorName
  }
}) {
  const [flippedCard, setFlippedCard] = useState(false)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [total, setTotal] = useState(0)

  const getTotals = () => {
    const withoutFee = attendees > minimum ? pricePerson * attendees : pricePerson * minimum
    const fee = withoutFee * serviceFee
    const tax = (withoutFee + fee + additionals) * salesTax
    const finalValue = withoutFee + additionals + fee + tax

    setTotal(finalValue.toFixed(2))
  }

  useEffect(() => {
    getTotals()
  }, [serviceFee, attendees, pricePerson, minimum, additionals])

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
          </p>
          <p className="small">{classTitle}</p>
          <p className="small">
            <strong>ID:</strong> {_id}
          </p>
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
                <td className="text-right small">{variant && variant.title}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small">Created</th>
                <td className="text-right small">{` ${moment(createdAt).format('LL')}`}</td>
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
    <Card className="card-board">
      <CardBody className="p-1">
        <Button color="link" className="flip-button text-muted" onClick={() => setFlippedCard(!flippedCard)}>
          <Repeat size={14} />
        </Button>
        {flippedCard ? cardBack() : cardFront()}
      </CardBody>
      <CardFooter className="card-board-footer pr-1">
        {status === 'quote' ? (
          <div align="right">
            <CardLink href={`https://www.teamclass.com/booking/select-date-time/${_id}`} target={'_blank'} title={'Select date and time link'}>
              <Avatar color="light-primary" size="sm" icon={<Calendar size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" size="sm" icon={<Edit2 size={18} />} />
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
            <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" size="sm" icon={<Edit2 size={18} />} />
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
            <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" size="sm" icon={<Edit2 size={18} />} />
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
            <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" size="sm" icon={<Edit2 size={18} />} />
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
            <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" size="sm" icon={<Edit2 size={18} />} />
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
            <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" size="sm" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : status !== 'canceled' ? (
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
            <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" size="sm" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : (
          <></>
        )}
      </CardFooter>
    </Card>
  )
}

export default BoardCard
