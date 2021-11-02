import React, { Fragment, useState, useEffect, useContext } from 'react'
import DataTableBookings from './TableBookings/TableBookings'
import BoardBookings from './BoardBookings/BoardBookings'
import queryAllBookings from '../../graphql/QueryAllBookings'
import queryAllCalendarEvents from '../../graphql/QueryAllCalendarEvents'
import queryAllCustomers from '../../graphql/QueryAllCustomers'
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators'
import queryAllClasses from '../../graphql/QueryAllClasses'
import { useQuery } from '@apollo/client'
import { Col, Spinner } from 'reactstrap'
import BookingsHeader from './BookingsHeader/BookingsHeader'
import FiltersModal from './BoardBookings/FiltersModal'
import AddNewBooking from './AddNewBooking'
import { FiltersContext } from '../../context/FiltersContext/FiltersContext'
import { getCustomerPhone, getCustomerCompany, getCustomerEmail, getClassTitle } from './common'
import { absoluteUrl } from '../../utility/Utils'

const BookingList = () => {
  const [genericFilter, setGenericFilter] = useState({})
  const [bookingsFilter, setBookingsFilter] = useState({})
  const [bookings, setBookings] = useState([])
  const [limit, setLimit] = useState(600)
  const [customers, setCustomers] = useState([])
  const [coordinators, setCoordinators] = useState([])
  const [classes, setClasses] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])
  const [switchView, setSwitchView] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentElement, setCurrentElement] = useState(null)
  const { classFilterContext, coordinatorFilterContext, textFilterContext } = useContext(FiltersContext)
  const [filteredBookings, setFilteredBookings] = useState([])

  const { ...allBookingsResult } = useQuery(queryAllBookings, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: bookingsFilter,
      limit
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allBookingsResult.data) {
      setBookings(allBookingsResult.data.bookings.map((element) => element))
    }
  }, [allBookingsResult.data])

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '')
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

  const { ...allCoordinatorResult } = useQuery(queryAllCoordinators, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allCustomersResult.data) setCustomers(allCustomersResult.data.customers)
  }, [allCustomersResult.data])

  useEffect(() => {
    if (allCoordinatorResult.data) setCoordinators(allCoordinatorResult.data.eventCoordinators)
  }, [allCoordinatorResult.data])

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

  useEffect(() => {
    if (classFilterContext && coordinatorFilterContext) {
      const query = {
        eventCoordinatorId_in: coordinatorFilterContext.value,
        teamClassId: classFilterContext.value
      }
      setBookingsFilter(query)
    } else if (classFilterContext) {
      const query = {
        teamClassId: classFilterContext.value
      }
      setBookingsFilter(query)
    } else if (coordinatorFilterContext) {
      const query = {
        eventCoordinatorId_in: coordinatorFilterContext.value
      }
      setBookingsFilter(query)
    } else {
      setBookingsFilter({})
    }
  }, [classFilterContext, coordinatorFilterContext])

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '')
  }, [textFilterContext])

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
      {allClasses.loading ||
      allCoordinatorResult.loading ||
      allBookingsResult.loading ||
      allCalendarEventsResults.loading ||
      allCustomersResult.loading ? (
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
                <DataTableBookings
                  filteredData={filteredBookings}
                  customers={customers}
                  calendarEvents={calendarEvents}
                  classes={classes}
                  coordinators={coordinators}
                  bookings={bookings}
                />
              ) : (
                <BoardBookings
                  filteredBookings={filteredBookings}
                  customers={customers}
                  calendarEvents={calendarEvents}
                  classes={classes}
                  coordinators={coordinators}
                  bookings={bookings}
                  setBookings={setBookings}
                  setCustomers={setCustomers}
                />
              )}
            </Col>
            <FiltersModal
              open={showFiltersModal}
              handleModal={() => setShowFiltersModal(!showFiltersModal)}
              classes={classes}
              coordinators={coordinators}
            />
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
              coordinators={coordinators}
            />
          </>
        )
      )}
    </Fragment>
  )
}
export default BookingList
