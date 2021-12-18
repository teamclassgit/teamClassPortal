// @packages
import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Spinner } from 'reactstrap';
import { useQuery, useLazyQuery } from '@apollo/client';

// @scripts
import BookingsHeader from '../booking/BookingsHeader/BookingsHeader';
import Calendar from './calendar';
import queryAllBookings from '../../graphql/QueryAllBookings';
import queryAllCalendarEvents from '../../graphql/QueryAllCalendarEvents';
import queryAllClasses from '../../graphql/QueryAllClasses';
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators';
import queryAllCustomers from '../../graphql/QueryAllCustomers';
import { FiltersContext } from '../../context/FiltersContext/FiltersContext';
import { getCustomerEmail, getClassTitle, getCustomerCompany } from '../booking/common';
import FiltersModal from '../booking/BoardBookings/FiltersModal';

const BookingCalendarList = () => {
  const excludedBookings = ['closed', 'canceled'];
  const genericFilter = {};
  const [bookingsFilter, setBookingsFilter] = useState({ status_nin: excludedBookings });
  const [bookings, setBookings] = useState([]);
  const [limit, setLimit] = useState(20000);
  const [customers, setCustomers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [classes, setClasses] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [elementToAdd, setElementToAdd] = useState({});
  const { classFilterContext, coordinatorFilterContext, textFilterContext, dateFilterContext } = useContext(FiltersContext);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [getBookings, { ...allBookingsResult }] = useLazyQuery(queryAllBookings, {
    fetchPolicy: 'no-cache',
    pollInterval: 200000,
    onCompleted: (data) => {
      if (data) setBookings(data.bookings.map((element) => element));
    }
  });

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
    handleSearch((textFilterContext && textFilterContext.value) || '');
  }, [bookings]);

  useEffect(() => {
    let query = {
      status_nin: excludedBookings
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

    setBookingsFilter(query);
  }, [classFilterContext, coordinatorFilterContext, dateFilterContext]);

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
      <p>Calendar</p>
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
        showLimit={false}
        showExport={true}
        showAdd={false}
        showFilter={true}
        showView={false}
        titleView={'Events Calendar '}
        isClosedBookings={false}
      />
      <FiltersModal
        open={showFiltersModal}
        handleModal={() => setShowFiltersModal(!showFiltersModal)}
        classes={classes}
        coordinators={coordinators}
        calendarEvents={calendarEvents}
        isFilterByClass={true}
        isFilterByCoordinator={true}
        isFilterByCreationDate={false}
      />
      {allBookingsResult.loading || allCalendarEventsResults.loading || allClasses.loading || allCustomersResult.loading ? (
        <div>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </div>
      ) : (
        <Calendar bookings={filteredBookings} calendarEvents={calendarEvents} classes={classes} customers={customers} />
      )}
    </>
  );
};

export default BookingCalendarList;
