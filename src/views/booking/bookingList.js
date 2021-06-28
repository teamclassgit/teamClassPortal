import React, { Fragment, useState, useEffect } from 'react'
import DataTableBookings from './TableBookings'
import BoardBookings from './BoardBookings/BoardBookings'
import queryAllBookings from '../../graphql/QueryAllBookings'
import queryAllCalendarEvents from '../../graphql/QueryAllCalendarEvents'
import queryAllCustomers from '../../graphql/QueryAllCustomers'
import queryAllClasses from '../../graphql/QueryAllClasses'
import { useQuery } from '@apollo/client'
import { Col, Row, Spinner } from 'reactstrap'
import CardColumnsBoard from '../../@core/components/CardColumnsBoard/CardColumnsBoard'
import BookingsHeader from './BookingsHeader/BookingsHeader'
import FiltersModal from './BoardBookings/FiltersModal'
import AddNewBooking from './AddNewBooking'

const BookingList = () => {
  const [genericFilter, setGenericFilter] = useState({ id: { ne: '' } })
  const [bookings, setBookings] = useState([])
  const [customers, setCustomers] = useState([])
  const [classes, setClasses] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])
  const [switchView, setSwitchView] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentElement, setCurrentElement] = useState(null)

  const { ...allBookingsResult } = useQuery(queryAllBookings, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    }
  })

  useEffect(() => {
    if (allBookingsResult.data) setBookings(allBookingsResult.data.listBookings.items.map((element) => element))
  }, [allBookingsResult.data])

  const { ...allCalendarEventsResults } = useQuery(queryAllCalendarEvents, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    }
  })

  useEffect(() => {
    if (allCalendarEventsResults.data) setCalendarEvents(allCalendarEventsResults.data.listCalendarEvents.items)
  }, [allCalendarEventsResults.data])

  const { ...allCustomersResult } = useQuery(queryAllCustomers, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    }
  })

  useEffect(() => {
    if (allCustomersResult.data) setCustomers(allCustomersResult.data.listCustomers.items)
  }, [allCustomersResult.data])

  const { ...allClasses } = useQuery(queryAllClasses, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    }
  })

  useEffect(() => {
    if (allClasses.data) setClasses(allClasses.data.listTeamClasses.items)
  }, [allClasses.data])

  const handleModal = () => setShowAddModal(!showAddModal)

  // ** Function to handle Modal toggle
  return (
    <Fragment>
      {(allClasses.loading || allBookingsResult.loading || allCalendarEventsResults.loading || allCustomersResult.loading) && (
        <div>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </div>
      )}
      {allBookingsResult && allBookingsResult.data && (
        <>
          <BookingsHeader
            setShowFiltersModal={(val) => setShowFiltersModal(val)}
            switchView={switchView}
            setSwitchView={() => setSwitchView(!switchView)}
            showAddModal={() => handleModal()}
            setCurrentElement={(d) => setCurrentElement(d)}
            classes={classes}
            customers={customers}
            bookings={bookings}
          />
          <Col sm="12">
            {bookings && bookings.length > 0 && switchView ? (
              <DataTableBookings
                bookings={bookings}
                customers={customers}
                setCustomers={setCustomers}
                calendarEvents={calendarEvents}
                classes={classes}
                changeView={() => setSwitchView(!switchView)}
              />
            ) : (
              <BoardBookings
                bookings={bookings}
                customers={customers}
                setCustomers={setCustomers}
                calendarEvents={calendarEvents}
                classes={classes}
                changeView={() => setSwitchView(!switchView)}
                setCurrentElement={(d) => {
                  setCurrentElement(d)
                  handleModal()
                }}
              />
            )}
          </Col>
          <FiltersModal open={showFiltersModal} handleModal={() => setShowFiltersModal(!showFiltersModal)} classes={classes} />
          <AddNewBooking
            open={showAddModal}
            handleModal={handleModal}
            data={[]}
            setData={(x) => console.log(x)}
            classes={classes}
            setCustomers={setCustomers}
            customers={customers}
            currentElement={currentElement}
            editMode={currentElement?.editMode}
          />
        </>
      )}
    </Fragment>
  )
}
export default BookingList
