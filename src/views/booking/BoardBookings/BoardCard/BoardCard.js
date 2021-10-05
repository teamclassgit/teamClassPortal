import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Card, CardBody, CardFooter, Button, Media, CardLink, FormText, Badge } from 'reactstrap'
import { Calendar, Edit2, ShoppingCart, Repeat, User, Users, Check, DollarSign } from 'react-feather'
import { toAmPm } from '../../../../utility/Utils'
import './BoardCard.scss'
import Avatar from '@components/avatar'
import { RUSH_FEE } from '../../../../utility/Constants'

function BoardCard({
  setCurrentElement,
  content: {
    customerName,
    _id,
    attendees,
    teamClassId,
    createdAt,
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
    customerId
  }
}) {
  const [flippedCard, setFlippedCard] = useState(false)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [totalWithoutFee, setTotalWithoutFee] = useState(0)
  const [totalTax, setTotalTax] = useState(0)
  const [totalRushFee, setTotalTotalRushFee] = React.useState(0)
  const [totalServiceFee, setTotalServiceFee] = useState(0)
  const [total, setTotal] = useState(0)

  const getTotals = () => {
    const withoutFee = attendees > minimum ? pricePerson * attendees : pricePerson * minimum
    const rushFee = calendarEvent && calendarEvent.rushFee ? withoutFee * RUSH_FEE : 0
    const fee = withoutFee * serviceFee
    const tax = (withoutFee + fee + additionals + rushFee) * salesTax
    const finalValue = withoutFee + additionals + fee + rushFee + tax

    setTotalTax(tax.toFixed(2))
    setTotalWithoutFee(withoutFee.toFixed(2))
    setTotalServiceFee(fee.toFixed(2))
    setTotalTotalRushFee(rushFee.toFixed(2))
    setTotal(finalValue.toFixed(2))
  }

  useEffect(() => {
    getTotals()
  }, [serviceFee, attendees, pricePerson, minimum, additionals])

  const formatTime = () => toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, teamClass && teamClass.timeZoneLabel)

  useEffect(() => {
    setDate(calendarEvent ? new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day) : null)
    setTime(calendarEvent ? formatTime() : null)
  }, [calendarEvent, teamClass])

  const cardBack = () => {
    return (
      <>
        <div className="pb-2">
          <p className="text-truncate">
            <small>
              # {_id} - {classTitle}
            </small>
          </p>
          <p className="text-truncate p-0 m-0">{teamClass.title}</p>
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
                <th className="font-weight-normal text-sm">
                  ${pricePerson} x {attendees} attendees
                  {attendees < minimum && <FormText color="muted">Under 10 group fee</FormText>}
                </th>
                <td className="text-right text-sm align-top">${totalWithoutFee}</td>
              </tr>
              <tr>
                <th className="font-weight-normal text-sm">Booking fee ({serviceFee * 100}%)</th>
                <td className="text-right text-sm">${totalServiceFee}</td>
              </tr>
              {calendarEvent && calendarEvent.rushFee && (
                <tr>
                  <th className="font-weight-normal text-sm pb-1">Rush fee ({RUSH_FEE * 100}%)</th>
                  <td className="text-right pb-1 text-sm">${totalRushFee}</td>
                </tr>
              )}
              <tr>
                <th className="font-weight-normal text-sm">Sales Tax ({salesTax * 100}%)</th>
                <td className="text-right text-sm">${totalTax}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-top">
                <th className="pt-1 text-sm">Total</th>
                <td className="font-weight-bold text-sm text-right pt-1">${total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    )
  }

  const cardFront = () => {
    return (
      <>
        <p className="text-truncate m-0 p-0">
          <strong>
            {customerName} - {classTitle}
          </strong>
        </p>
        <p className="m-0 p-0">
          <small className="">
            {moment(createdAt).calendar(null, {
              lastDay: '[Yesterday]',
              sameDay: 'LT',
              lastWeek: 'dddd',
              sameElse: 'MMMM Do, YYYY'
            })}
          </small>{' '}
          | $ {total}
        </p>
      </>
    )
  }

  return (
    <Card className="card-board">
      <CardBody>
        <Button color="link" className="flip-button text-muted" onClick={() => setFlippedCard(!flippedCard)}>
          <Repeat size={14} />
        </Button>
        {flippedCard ? cardBack() : cardFront()}
      </CardBody>
      <CardFooter className="card-board-footer pr-1">
        {status === 'quote' ? (
          <div align="right">
            <CardLink href={`https://www.teamclass.com/booking/select-date-time/${_id}`} target={'_blank'} title={'Select date and time Page'}>
              <Avatar color="light-primary" icon={<Calendar size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : status !== 'canceled' ? (
          <div align="right">
            <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up page'}>
              <Avatar color="light-primary" icon={<User size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
              <Avatar color="light-primary" icon={<Users size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Checkout status'}>
              <Avatar color="light-primary" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${_id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" icon={<Edit2 size={18} />} />
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
