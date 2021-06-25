import React, { Fragment, useState } from 'react'
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
  const [genericFilter, setGenericFilter] = React.useState({ id: { ne: '' } })
  const [bookings, setBookings] = React.useState([])
  const [customers, setCustomers] = React.useState([])
  const [classes, setClasses] = React.useState([])
  const [calendarEvents, setCalendarEvents] = React.useState([])
  const [switchView, setSwitchView] = React.useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [modal, setModal] = useState(false)

  const { ...allBookingsResult } = useQuery(queryAllBookings, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    }
  })

  React.useEffect(() => {
    if (allBookingsResult.data) setBookings(allBookingsResult.data.listBookings.items.map((element) => element))
  }, [allBookingsResult.data])

  const { ...allCalendarEventsResults } = useQuery(queryAllCalendarEvents, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    }
  })

  React.useEffect(() => {
    if (allCalendarEventsResults.data) setCalendarEvents(allCalendarEventsResults.data.listCalendarEvents.items)
  }, [allCalendarEventsResults.data])

  const { ...allCustomersResult } = useQuery(queryAllCustomers, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    }
  })

  React.useEffect(() => {
    if (allCustomersResult.data) setCustomers(allCustomersResult.data.listCustomers.items)
  }, [allCustomersResult.data])

  const { ...allClasses } = useQuery(queryAllClasses, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    }
  })

  React.useEffect(() => {
    if (allClasses.data) setClasses(allClasses.data.listTeamClasses.items)
  }, [allClasses.data])

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)
  return (
    <Fragment>
      {(allClasses.loading || allBookingsResult.loading || allCalendarEventsResults.loading || allCustomersResult.loading) && (
        <div>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </div>
      )}
      {allBookingsResult && allBookingsResult.data && (
        <Row>
          <BookingsHeader
            setShowFiltersModal={(val) => setShowFiltersModal(val)}
            switchView={switchView}
            setSwitchView={() => setSwitchView(!switchView)}
            handleModal={() => handleModal()}
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
              />
            )}
          </Col>
          <FiltersModal open={showFiltersModal} handleModal={() => setShowFiltersModal(!showFiltersModal)} classes={classes} />
          {/* <AddNewBooking
            open={modal}
            handleModal={handleModal}
            data={[]}
            setData={(x) => console.log(x)}
            classes={classes}
            setCustomers={setCustomers}
            customers={customers}
            currentElement={currentElement}
            editMode={currentElement?.editMode}
          /> */}
        </Row>
      )}
    </Fragment>
  )
}
export default BookingList
