// @packages
import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Col, Spinner } from 'reactstrap';
import { useQuery, useLazyQuery } from '@apollo/client';

// @scripts
import AddNewBooking from './AddNewBooking';
import BookingsHeader from './BookingsHeader/BookingsHeader';
import DataTableClosedBookings from './TableBookings/TableClosedBookings';
import EditBookingModal from '../../components/EditBookingModal';
import FiltersModal from './BoardBookings/FiltersModal';
import queryAllBookings from '../../graphql/QueryAllBookings';
import queryAllCalendarEvents from '../../graphql/QueryAllCalendarEvents';
import queryAllClasses from '../../graphql/QueryAllClasses';
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators';
import queryAllCustomers from '../../graphql/QueryAllCustomers';
import { FiltersContext } from '../../context/FiltersContext/FiltersContext';
import { getCustomerEmail, getClassTitle } from './common';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [bookingsFilter, setBookingsFilter] = useState({ status_in: 'closed' });
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [currentElement, setCurrentElement] = useState({});
  const [customers, setCustomers] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [elementToAdd, setElementToAdd] = useState({});
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [genericFilter] = useState({});
  const [limit, setLimit] = useState(200);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const { classFilterContext, coordinatorFilterContext, textFilterContext, dateFilterContext, closedReasonFilterContext } =
    useContext(FiltersContext);

  const handleEditModal = () => setEditModal(!editModal);

  const [getBookings, { ...allBookingsResult }] = useLazyQuery(queryAllBookings, {
    fetchPolicy: 'no-cache',
    pollInterval: 200000,
    onCompleted: (data) => {
      if (data) setBookings(data.bookings.map((element) => element));
    }
  });

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '');
  }, [bookings]);

  const [getCalendarEvents, { ...allCalendarEventsResults }] = useLazyQuery(queryAllCalendarEvents, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data) {
        setCalendarEvents(data.calendarEvents);
        getBookings({
          variables: {
            filter: bookingsFilter,
            limit
          }
        });
      }
    }
  });

  const { ...allCustomersResult } = useQuery(queryAllCustomers, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) setCustomers(data.customers);
    },
    pollInterval: 200000
  });

  const { ...allCoordinatorResult } = useQuery(queryAllCoordinators, {
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) setCoordinators(data.eventCoordinators);
    },
    pollInterval: 200000
  });

  const { ...allClasses } = useQuery(queryAllClasses, {
    pollInterval: 200000,
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data && data.teamClasses) {
        setClasses(data.teamClasses);
        getCalendarEvents({
          variables: {
            filter: genericFilter
          }
        });
      }
    }
  });

  const handleModal = () => setShowAddModal(!showAddModal);

  const handleSearch = (value) => {
    if (value.length) {
      const updatedData = bookings.filter((item) => {
        const startsWith =
          (item.customerName && item.customerName.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.customerId && getCustomerEmail(item.customerId, customers).toLowerCase().startsWith(value.toLowerCase())) ||
          (item.teamClassId && getClassTitle(item.teamClassId, classes).toLowerCase().startsWith(value.toLowerCase())) ||
          item._id.startsWith(value);

        const includes =
          (item.customerName && item.customerName.toLowerCase().includes(value.toLowerCase())) ||
          (item.customerId && getCustomerEmail(item.customerId, customers).toLowerCase().includes(value.toLowerCase())) ||
          (item.teamClassId && getClassTitle(item.teamClassId, classes).toLowerCase().includes(value.toLowerCase())) ||
          item._id.includes(value);

        return startsWith || includes;
      });

      setFilteredBookings(updatedData);
    } else {
      setFilteredBookings(bookings);
    }
  };

  useEffect(() => {
    let query = {
      status_in: 'closed'
    };

    if (classFilterContext) {
      query = { ...query, teamClassId: classFilterContext.value };
    }

    if (coordinatorFilterContext) {
      query = { ...query, eventCoordinatorId_in: coordinatorFilterContext.value };
    }

    if (dateFilterContext) {
      query = {
        ...query,
        createdAt_gte: moment(dateFilterContext.value[0]).format(),
        createdAt_lte: moment(dateFilterContext.value[1]).add(23, 'hours').add(59, 'minutes').format()
      };
    }

    if (closedReasonFilterContext) {
      query = { ...query, closedReason: closedReasonFilterContext.value };
    }

    setBookingsFilter(query);
  }, [classFilterContext, coordinatorFilterContext, dateFilterContext, closedReasonFilterContext]);

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '');
  }, [textFilterContext]);

  useEffect(() => {

    if (calendarEvents && customers && classes) getBookings({
      variables: {
        filter: bookingsFilter,
        limit
      }
    });

  }, [bookingsFilter, limit]);

  return (
    <>
      <BookingsHeader
        setShowFiltersModal={(val) => setShowFiltersModal(val)}
        showAddModal={() => handleModal()}
        setElementToAdd={(d) => setElementToAdd(d)}
        onChangeLimit={(newLimit) => {
          setLimit(newLimit);
        }}
        bookings={filteredBookings}
        customers={customers}
        coordinators={coordinators}
        classes={classes}
        calendarEvents={calendarEvents}
        defaultLimit={limit}
        showLimit={true}
        showExport={true}
        showAdd={false}
        showFilter={true}
        showView={false}
        titleView={'Closed Bookings '}
        isClosedBookings={true}
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
                {bookings && bookings.length > 0 && (
                  <DataTableClosedBookings
                    filteredData={filteredBookings}
                    handleEditModal={(element) => {
                      setCurrentElement(element);
                      handleEditModal();
                    }}
                    bookings={bookings}
                    calendarEvents={calendarEvents}
                    classes={classes}
                    coordinators={coordinators}
                    customers={customers}
                  />
                )}
              </Col>
              <FiltersModal
                calendarEvents={calendarEvents}
                classes={classes}
                coordinators={coordinators}
                handleModal={() => setShowFiltersModal(!showFiltersModal)}
                isFilterByClass={true}
                isFilterByCoordinator={true}
                isFilterByCreationDate={true}
                isFilterByClosedReason={true}
                open={showFiltersModal}
              />
              <AddNewBooking
                baseElement={elementToAdd}
                bookings={bookings}
                classes={classes}
                coordinators={coordinators}
                customers={customers}
                handleModal={handleModal}
                open={showAddModal}
                setBookings={setBookings}
                setCustomers={setCustomers}
              />
              <EditBookingModal
                allBookings={bookings}
                allCalendarEvents={calendarEvents}
                allClasses={classes}
                allCoordinators={coordinators}
                allCustomers={customers}
                currentElement={currentElement}
                editMode={false}
                handleClose={() => setCurrentElement({})}
                handleModal={handleEditModal}
                open={editModal}
                setBookings={setBookings}
                setCustomers={setCustomers}
              />
            </>
          )
        )}
    </>
  );
};

export default BookingList;
