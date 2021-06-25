import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Card, CardBody, CardFooter, Button, Media, CardLink, FormText, Badge } from 'reactstrap'
import { Calendar, Edit2, ShoppingCart, Repeat } from 'react-feather'
import { toAmPm } from '../../../../utility/Utils'
import './BoardCard.scss'
import Avatar from '@components/avatar'

function BoardCard({
  setCurrentElement,
  showAddModal,
  content: {
    customerName,
    id,
    attendees,
    teamClassId,
    createdAt,
    status,
    classTitle,
    scheduled,
    email,
    phone,
    company,
    serviceFee,
    pricePerson,
    minimum,
    salesTax,
    additionals,
    calendarEvent,
    teamClass
  }
}) {
  const [flippedCard, setFlippedCard] = useState(false)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [totalWithoutFee, setTotalWithoutFee] = useState(0)
  const [totalTax, setTotalTax] = useState(0)
  const [totalServiceFee, setTotalServiceFee] = useState(0)
  const [total, setTotal] = useState(0)

  const getTotals = () => {
    const withoutFee = attendees > minimum ? pricePerson * attendees : pricePerson * minimum
    const fee = withoutFee * serviceFee
    const tax = (withoutFee + additionals + fee) * salesTax
    const finalValue = withoutFee + additionals + fee + tax

    setTotalTax(tax.toFixed(2))
    setTotalWithoutFee(withoutFee.toFixed(2))
    setTotalServiceFee(fee.toFixed(2))
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
              # {id} - {classTitle}
            </small>
          </p>
          <p className="text-truncate p-0 m-0">{teamClass.title}</p>
          <p className="text-muted text-sm mb-0">
            {teamClass.duration * 60} Minutes | {teamClass.hasKit ? 'Kit included' : ''}
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
      <CardFooter className="card-board-footer">
        <Button
          color="link"
          className="m-0 p-0"
          onClick={() => {
            const newElement = {
              name: customerName,
              email,
              phone,
              company,
              class: teamClassId,
              attendees,
              editMode: true
            }
            setCurrentElement(newElement)
            showAddModal()
          }}
        >
          <Avatar color="light-primary" className="rounded mr-1" icon={<Edit2 size={18} />} />
        </Button>
        <CardLink href={`/booking/${id}`} target={'blank'}>
          <Avatar color="light-secondary" className="rounded mr-1" icon={<ShoppingCart size={18} />} />
        </CardLink>
      </CardFooter>
    </Card>
  )
}

export default BoardCard
