import React, { Fragment, useState, useEffect, useContext } from 'react'
import DataTableBookings from './TableBookings/TableBookings'
import BoardBookings from './BoardBookings/BoardBookings'
import queryAllBookings from '../../graphql/QueryAllBookings'
import queryAllCalendarEvents from '../../graphql/QueryAllCalendarEvents'
import queryAllCustomers from '../../graphql/QueryAllCustomers'
import queryAllClasses from '../../graphql/QueryAllClasses'
import { useQuery } from '@apollo/client'
import { Col, Spinner } from 'reactstrap'
import BookingsHeader from './BookingsHeader/BookingsHeader'
import FiltersModal from './BoardBookings/FiltersModal'
import AddNewBooking from './AddNewBooking'
import { FiltersContext } from '../../context/FiltersContext/FiltersContext'
import { getCustomerPhone, getCustomerCompany, getCustomerEmail, getCustomerName, getClassTitle, getFormattedEventDate } from './common'

const BookingList = () => {
  const [genericFilter, setGenericFilter] = useState({})
  const [bookings, setBookings] = useState([])
  const [limit, setLimit] = useState(600)
  const [customers, setCustomers] = useState([])
  const [classes, setClasses] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])
  const [switchView, setSwitchView] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentElement, setCurrentElement] = useState(null)
  const { classFilterContext } = useContext(FiltersContext)
  const [filteredBookings, setFilteredBookings] = useState([])

  const { ...allBookingsResult } = useQuery(queryAllBookings, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter,
      limit
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allBookingsResult.data) setBookings(allBookingsResult.data.bookings.map((element) => element))
  }, [allBookingsResult.data])

  useEffect(() => {
    setFilteredBookings(bookings)
  }, [bookings])

  const { ...allCalendarEventsResults } = useQuery(queryAllCalendarEvents, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allCalendarEventsResults.data) setCalendarEvents(allCalendarEventsResults.data.calendarEvents)
  }, [allCalendarEventsResults.data])

  const { ...allCustomersResult } = useQuery(queryAllCustomers, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allCustomersResult.data) setCustomers(allCustomersResult.data.customers)
  }, [allCustomersResult.data])

  const { ...allClasses } = useQuery(queryAllClasses, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allClasses.data) setClasses(allClasses.data.teamClasses)
  }, [allClasses.data])

  const handleModal = () => setShowAddModal(!showAddModal)

  const handleFilterByClass = (classId) => {
    const newBookings = bookings.filter(({ teamClassId }) => teamClassId === classId)
    setFilteredBookings(newBookings)
  }

  const handleSearch = (value) => {
    if (value.length) {
      const updatedData = bookings.filter((item) => {
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
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (classFilterContext) {
      handleFilterType(classFilterContext)
    } else {
      setFilteredBookings(bookings)
    }
  }, [classFilterContext])

  // ** Function to handle Modal toggle
  return (
    <Fragment>
      <BookingsHeader
        setShowFiltersModal={(val) => setShowFiltersModal(val)}
        switchView={switchView}
        setSwitchView={() => setSwitchView(!switchView)}
        showAddModal={() => handleModal()}
        setCurrentElement={(d) => setCurrentElement(d)}
        onChangeLimit={(newLimit) => {
          setLimit(newLimit)
        }}
        bookings={filteredBookings}
        defaultLimit={limit}
      />
      {allClasses.loading || allBookingsResult.loading || allCalendarEventsResults.loading || allCustomersResult.loading ? (
        <div>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </div>
      ) : (
        filteredBookings &&
        customers &&
        calendarEvents &&
        classes && (
          <>
            <Col sm="12">
              {bookings && bookings.length > 0 && switchView ? (
                <DataTableBookings filteredData={filteredBookings} customers={customers} calendarEvents={calendarEvents} classes={classes} />
              ) : (
                <BoardBookings filteredBookings={filteredBookings} customers={customers} calendarEvents={calendarEvents} classes={classes} />
              )}
            </Col>
            <FiltersModal open={showFiltersModal} handleModal={() => setShowFiltersModal(!showFiltersModal)} classes={classes} />
            <AddNewBooking
              open={showAddModal}
              handleModal={handleModal}
              bookings={bookings}
              classes={classes}
              setCustomers={setCustomers}
              customers={customers}
              currentElement={currentElement}
              editMode={currentElement?.editMode}
              setBookings={setBookings}
            />
          </>
        )
      )}
    </Fragment>
  )
}
export default BookingList
