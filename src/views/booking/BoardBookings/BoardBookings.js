// ** React Imports
import React, { useEffect, useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import moment from 'moment'
import { Row } from 'reactstrap'
import mutationUpdateBookingStatus from '../../../graphql/MutationUpdateBookingStatus'
import BoardCard from './BoardCard/BoardCard'
import Board from '@lourenci/react-kanban'
import { toAmPm } from '../../../utility/Utils'
import { FiltersContext } from '../../../context/FiltersContext/FiltersContext'
import './BoardBookings.scss'
import '@lourenci/react-kanban/dist/styles.css'

const BOOKING_STATUS = [
  { label: 'Quote', value: 'quote' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Kit Fullfitment', value: 'kitfullfitment' },
  { label: 'Completed', value: 'completed' }
]

const BoardBookings = ({ bookings, customers, classes, calendarEvents, setCurrentElement }) => {
  const { classFilterContext } = useContext(FiltersContext)
  const [loading, setLoading] = useState(false)
  const [filteredBookings, setFilteredBookings] = useState([])
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [updateBookingStatus] = useMutation(mutationUpdateBookingStatus, {})

  useEffect(() => {
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

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

  const getCustomerPhone = (customerId) => {
    const result = customers.filter((element) => element.id === customerId)
    return result && result.length > 0 ? result[0].phone : ''
  }

  const getCustomerCompany = (customerId) => {
    const result = customers.filter((element) => element.id === customerId)
    return result && result.length > 0 ? result[0].company : ''
  }

  const getCustomerEmail = (customerId) => {
    const result = customers.filter((element) => element.id === customerId)
    return result && result.length > 0 ? result[0].email : ''
  }

  const getClassTitle = (teamClassId) => {
    const result = classes.filter((element) => element.id === teamClassId)
    return result && result.length > 0 ? result[0].title : ''
  }

  const getFormattedEventDate = (bookingId) => {
    const result = calendarEvents.filter((element) => element.bookingId === bookingId)

    if (result && result.length > 0) {
      const calendarEvent = result[0]
      const date = new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day)
      const time = toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, '')
      return `${moment(date).format('LL')} ${time}`
    }

    return ''
  }

  const bookingCards = filteredBookings.map(
    ({ id, teamClassId, customerId, customerName, attendees, classMinimum, pricePerson, serviceFee, salesTax, status, createdAt }) => {
      return {
        customerName,
        id,
        attendees,
        teamClassId,
        createdAt,
        status,
        classTitle: getClassTitle(teamClassId),
        scheduled: getFormattedEventDate(id),
        email: getCustomerEmail(customerId),
        phone: getCustomerPhone(customerId),
        company: getCustomerCompany(customerId),
        serviceFee,
        pricePerson,
        minimum: classMinimum,
        salesTax,
        attendeesAdded: 0, // ????
        additionals: 0, // ?????
        calendarEvent: calendarEvents.filter((element) => element.bookingId === id)[0],
        teamClass: classes.filter((element) => element.id === teamClassId)[0]
      }
    }
  )

  const getBoard = () => {
    return {
      columns: BOOKING_STATUS.map(({ label, value }, index) => ({
        id: index,
        title: label,
        cards: bookingCards.filter(({ status }) => status === value)
      }))
    }
  }

  const handleSearch = (value) => {
    setLoading(true)
    let updatedData = []
    if (value.length) {
      updatedData = bookings.filter((item) => {
        const startsWith =
          (item.customerName && item.customerName.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.customerId && getCustomerEmail(item.customerId).toLowerCase().startsWith(value.toLowerCase())) ||
          (item.teamClassId && getClassTitle(item.teamClassId).toLowerCase().startsWith(value.toLowerCase()))

        const includes =
          (item.customerName && item.customerName.toLowerCase().includes(value.toLowerCase())) ||
          (item.customerId && getCustomerEmail(item.customerId).toLowerCase().includes(value.toLowerCase())) ||
          (item.teamClassId && getClassTitle(item.teamClassId).toLowerCase().includes(value.toLowerCase()))

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredBookings(updatedData)
    } else {
      setFilteredBookings(bookings)
    }
  }

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result
    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(data[0])
    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter
        result += item[key]
        ctr++
      })
      result += lineDelimiter
    })

    return result
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
    const bookingId = booking.id

    try {
      await updateBookingStatus({
        variables: {
          id: bookingId,
          status: newStatus
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
            disableColumnDrag
            initialBoard={getBoard()}
            onNewCardConfirm={(draftCard) => ({
              id: new Date().getTime(),
              ...draftCard
            })}
            onCardDragEnd={(a, card, source, destination) => handleDragCard(card, source, destination)}
            renderCard={(cardConTent) => (
              <BoardCard content={cardConTent} showAddModal={() => handleModal()} setCurrentElement={(data) => setCurrentElement(data)} />
            )}
          />
        ) : (
          ''
        )}
      </Row>
    </>
  )
}

export default BoardBookings
