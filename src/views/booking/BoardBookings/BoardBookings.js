import React, { useEffect, useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Row } from 'reactstrap'
import mutationUpdateBookingStatus from '../../../graphql/MutationUpdateBookingStatus'
import BoardCard from './BoardCard/BoardCard'
import Board from '@lourenci/react-kanban'
import { FiltersContext } from '../../../context/FiltersContext/FiltersContext'
import { BOOKING_STATUS } from '../../../utility/Constants'
import { getCustomerPhone, getCustomerCompany, getCustomerEmail, getCustomerName, getClassTitle, getFormattedEventDate } from '../common'
import './BoardBookings.scss'
import '@lourenci/react-kanban/dist/styles.css'

const BoardBookings = ({ bookings, customers, classes, calendarEvents, setCurrentElement }) => {
  const { classFilterContext } = useContext(FiltersContext)
  const [loading, setLoading] = useState(false)
  const [filteredBookings, setFilteredBookings] = useState([])
  const [data, setData] = useState([])
  const [updateBookingStatus] = useMutation(mutationUpdateBookingStatus, {})

  useEffect(() => {
    setLoading(true)
    setFilteredBookings(bookings)
  }, [bookings])

  useEffect(() => {
    setLoading(false)
    setData(filteredBookings)
  }, [filteredBookings])

  const handleFilterByClass = (classId) => {
    setLoading(true)
    const newBookings = bookings.filter(({ teamClassId }) => teamClassId === classId)
    setFilteredBookings(newBookings)
  }

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
      status,
      payments,
      createdAt
    }) => {
      return {
        customerName: getCustomerName(customerId, customers),
        _id,
        attendees,
        teamClassId,
        createdAt,
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

  const getBoard = () => {
    return {
      columns: BOOKING_STATUS.map(({ label, value }, index) => ({
        id: index,
        title: label,
        cards: getColumnData(value)
      }))
    }
  }

  const getColumnData = (column) => {
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

  const handleSearch = (value) => {
    setLoading(true)
    let updatedData = []
    if (value.length) {
      updatedData = bookings.filter((item) => {
        const startsWith =
          (item.customerName && item.customerName.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.customerId && getCustomerEmail(item.customerId, customers).toLowerCase().startsWith(value.toLowerCase())) ||
          (item.teamClassId && getClassTitle(item.teamClassId, classes).toLowerCase().startsWith(value.toLowerCase()))

        const includes =
          (item.customerName && item.customerName.toLowerCase().includes(value.toLowerCase())) ||
          (item.customerId && getCustomerEmail(item.customerId, customers).toLowerCase().includes(value.toLowerCase())) ||
          (item.teamClassId && getClassTitle(item.teamClassId, classes).toLowerCase().includes(value.toLowerCase()))

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredBookings(updatedData)
    } else {
      setLoading(true)
      setFilteredBookings(bookings)
    }
  }

  const handleFilterType = ({ type, value }) => {
    switch (type) {
      case 'class':
        handleFilterByClass(value)
        break
      case 'text':
        handleSearch(value)
      default:
        break
    }
  }

  useEffect(() => {
    if (classFilterContext) {
      handleFilterType(classFilterContext)
    } else {
      setLoading(true)
      setFilteredBookings(bookings)
    }
  }, [classFilterContext])

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
        {!loading && filteredBookings.length ? (
          <Board
            disableColumnDrag={true}
            initialBoard={getBoard()}
            onNewCardConfirm={(draftCard) => ({
              id: new Date().getTime(),
              ...draftCard
            })}
            onCardDragEnd={(a, card, source, destination) => handleDragCard(card, source, destination)}
            renderCard={(cardConTent) => <BoardCard content={cardConTent} setCurrentElement={(data) => setCurrentElement(data)} />}
          />
        ) : (
          ''
        )}
      </Row>
    </>
  )
}

export default BoardBookings