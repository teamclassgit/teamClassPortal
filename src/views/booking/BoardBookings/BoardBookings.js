import React, { useEffect, useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Row } from 'reactstrap'
import mutationUpdateBookingStatus from '../../../graphql/MutationUpdateBookingStatus'
import BoardCard from './BoardCard/BoardCard'
import Board from '@lourenci/react-kanban'
import { BOOKING_STATUS } from '../../../utility/Constants'
import { getCustomerPhone, getCustomerCompany, getCustomerEmail, getCustomerName, getClassTitle, getFormattedEventDate } from '../common'
import './BoardBookings.scss'
import '@lourenci/react-kanban/dist/styles.css'

const BoardBookings = ({ filteredBookings, customers, classes, calendarEvents }) => {
  const [updateBookingStatus] = useMutation(mutationUpdateBookingStatus, {})
  const [loading, setLoading] = useState(true)

  const getEmptyBoard = () => {
    return {
      columns: BOOKING_STATUS.map(({ label, value }, index) => ({
        id: index,
        title: label,
        cards: []
      }))
    }
  }

  const getLoadingBoard = () => {
    return {
      columns: BOOKING_STATUS.map(({ label, value }, index) => ({
        id: index,
        title: 'Loading...',
        cards: []
      }))
    }
  }

  const getColumnData = (bookingCards, column) => {
    if (column === 'quote' || column === 'canceled') return bookingCards.filter(({ status }) => status.indexOf(column) > -1)

    if (column === 'date-requested') {
      return bookingCards.filter(({ status, calendarEvent }) => {
        return status.indexOf(column) > -1 && calendarEvent && calendarEvent.status === 'reserved'
      })
    }

    if (column === 'accepted') {
      return bookingCards.filter(({ status, calendarEvent }) => {
        return status.indexOf('date-requested') > -1 && calendarEvent && calendarEvent.status === 'confirmed'
      })
    }

    if (column === 'rejected') {
      return bookingCards.filter(({ status, calendarEvent }) => {
        return status.indexOf('date-requested') > -1 && calendarEvent && calendarEvent.status === 'rejected'
      })
    }

    if (column === 'confirmed') {
      return bookingCards.filter(({ status, payments }) => {
        return status.indexOf(column) > -1 && payments && payments.length > 0
      })
    }

    if (column === 'reviews') {
      return bookingCards.filter(({ status, payments }) => {
        return status.indexOf('confirmed') > -1 && (!payments || payments.length === 0)
      })
    }

    return []
  }

  const getBoard = () => {
    const bookingCards = filteredBookings.map(
      ({
        _id,
        teamClassId,
        customerId,
        customerName,
        attendees,
        eventDurationHours,
        classMinimum,
        pricePerson,
        serviceFee,
        salesTax,
        classVariant,
        status,
        payments,
        createdAt,
        updatedAt
      }) => {
        return {
          customerName: getCustomerName(customerId, customers),
          _id,
          attendees,
          teamClassId,
          createdAt,
          updatedAt,
          variant: classVariant,
          status,
          payments,
          customerId,
          eventDurationHours,
          classTitle: getClassTitle(teamClassId, classes),
          scheduled: getFormattedEventDate(_id, calendarEvents),
          email: getCustomerEmail(customerId, customers),
          phone: getCustomerPhone(customerId, customers),
          company: getCustomerCompany(customerId, customers),
          serviceFee,
          pricePerson,
          minimum: classMinimum,
          salesTax,
          attendeesAdded: 0, // ????
          additionals: 0, // ?????
          calendarEvent: calendarEvents.find((element) => element.bookingId === _id),
          teamClass: classes.find((element) => element._id === teamClassId)
        }
      }
    )

    return {
      columns: BOOKING_STATUS.map(({ label, value }, index) => ({
        id: index,
        title: label,
        cards: getColumnData(bookingCards, value)
      }))
    }
  }

  const [loadingBoard, setLoadingBoard] = useState(getLoadingBoard())
  const [board, setBoard] = useState(getEmptyBoard())

  useEffect(() => {
    setLoading(true)
    const newBoard = getBoard()
    setBoard(newBoard)
    setLoading(false)
  }, [filteredBookings])

  // Here we change the status of the dragged card
  const handleDragCard = async (booking, source, destination) => {
    const sourceStatus = BOOKING_STATUS[source.fromColumnId].value
    const newStatus = BOOKING_STATUS[destination.toColumnId].value
    const bookingId = booking._id

    try {
      await updateBookingStatus({
        variables: {
          id: bookingId,
          status: newStatus,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Row>
        <Board
          disableColumnDrag={true}
          onNewCardConfirm={(draftCard) => ({
            id: new Date().getTime(),
            ...draftCard
          })}
          onCardDragEnd={(a, card, source, destination) => handleDragCard(card, source, destination)}
          renderCard={(cardConTent) => <BoardCard content={cardConTent} />}
        >
          {(!loading && board) || loadingBoard}
        </Board>
      </Row>
    </>
  )
}

export default BoardBookings
