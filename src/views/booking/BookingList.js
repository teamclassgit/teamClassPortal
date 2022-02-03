// @packages
import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Col, Spinner } from 'reactstrap';
import { useQuery } from '@apollo/client';

// @scripts
import AddNewBooking from '../../components/AddNewBooking';
import BoardBookings from './BoardBookings/BoardBookings';
import BookingsHeader from './BookingsHeader/BookingsHeader';
import EditBookingModal from '../../components/EditBookingModal';
import FiltersModal from './BoardBookings/FiltersModal';
import queryAllBookings from '../../graphql/QueryGetBookingsWithCriteria';
import queryAllClasses from '../../graphql/QueryAllClasses';
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators';
import queryAllCustomers from '../../graphql/QueryAllCustomers';
import { FiltersContext } from '../../context/FiltersContext/FiltersContext';

const BookingList = () => {
  const defaultFilter = [];
  const defaultSort = { dir: -1, id: 'updatedAt', name: 'updatedAt', type: 'date' };
  const defaultOrFilter = [];
  const [bookingsFilter, setBookingsFilter] = useState([...defaultOrFilter]);
  const [mainFilter, setMainFilter] = useState([]);
  const [sortInfo, setSortInfo] = useState(defaultSort);
  const [limit, setLimit] = useState(50);
  const [customers, setCustomers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentElement, setCurrentElement] = useState({});
  const [elementToAdd, setElementToAdd] = useState({});
  const { classFilterContext, coordinatorFilterContext, textFilterContext, dateFilterContext, setTextFilterContext } = useContext(FiltersContext);
  const [filteredBookingsQuote, setFilteredBookingsQuote] = useState([]);
  const [filteredBookingsRequested, setFilteredBookingsRequested] = useState([]);
  const [filteredBookingsAccepted, setFilteredBookingsAccepted] = useState([]);
  const [filteredBookingsDeposit, setFilteredBookingsDeposit] = useState([]);
  const [filteredBookingsPaid, setFilteredBookingsPaid] = useState([]);
  const [editModal, setEditModal] = useState(false);

  const handleEditModal = () => setEditModal(!editModal);

  const { ...allBookingsResultQuote } = useQuery(queryAllBookings, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
    variables: {
      filterBy: [
        ...mainFilter,
        {
          name: 'bookingStage',
          type: 'string',
          operator: 'eq',
          value: 'quote'
        }
      ],
      filterByOr: bookingsFilter,
      sortBy: sortInfo,
      limit,
      offset: 0
    },
    onCompleted: (data) => {
      if (data) setFilteredBookingsQuote(data.getBookingsWithCriteria);
    }
  });

  const { ...allBookingsResultRequested } = useQuery(queryAllBookings, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
    variables: {
      filterBy: [
        ...mainFilter,
        {
          name: 'status',
          type: 'string',
          operator: 'eq',
          value: 'date-requested'
        },
        {
          name: 'bookingStage',
          type: 'string',
          operator: 'neq',
          value: 'accepted'
        }
      ],
      filterByOr: bookingsFilter,
      sortBy: sortInfo,
      limit,
      offset: 0
    },
    onCompleted: (data) => {
      if (data) setFilteredBookingsRequested(data.getBookingsWithCriteria);
    }
  });

  const { ...allBookingsResultAccepted } = useQuery(queryAllBookings, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
    variables: {
      filterBy: [
        ...mainFilter,
        {
          name: 'bookingStage',
          type: 'string',
          operator: 'eq',
          value: 'accepted'
        }
      ],
      filterByOr: bookingsFilter,
      sortBy: sortInfo,
      limit,
      offset: 0
    },
    onCompleted: (data) => {
      if (data) setFilteredBookingsAccepted(data.getBookingsWithCriteria);
    }
  });

  const { ...allBookingsResultDeposit } = useQuery(queryAllBookings, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
    variables: {
      filterBy: [
        ...mainFilter,
        {
          name: 'bookingStage',
          type: 'string',
          operator: 'eq',
          value: 'deposit'
        }
      ],
      filterByOr: bookingsFilter,
      sortBy: sortInfo,
      limit,
      offset: 0
    },
    onCompleted: (data) => {
      if (data) setFilteredBookingsDeposit(data.getBookingsWithCriteria);
    }
  });

  const { ...allBookingsResultPaid } = useQuery(queryAllBookings, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
    variables: {
      filterBy: [
        ...mainFilter,
        {
          name: 'bookingStage',
          type: 'string',
          operator: 'eq',
          value: 'paid'
        }
      ],
      filterByOr: bookingsFilter,
      sortBy: sortInfo,
      limit,
      offset: 0
    },
    onCompleted: (data) => {
      if (data) setFilteredBookingsPaid(data.getBookingsWithCriteria);
    }
  });

  const { ...allClasses } = useQuery(queryAllClasses, {
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {}
    },
    onCompleted: (data) => {
      if (data && data.teamClasses) {
        setClasses(data.teamClasses);
      }
    }
  });

  const { ...allCoordinatorResult } = useQuery(queryAllCoordinators, {
    variables: {
      filter: {}
    },
    onCompleted: (data) => {
      if (data) setCoordinators(data.eventCoordinators);
    },
    fetchPolicy: 'cache-and-network'
  });

  const { ...allCustomersResult } = useQuery(queryAllCustomers, {
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {}
    },
    onCompleted: (data) => {
      if (data) setCustomers(data.customers);
    },
    pollInterval: 200000
  });

  const handleModal = () => setShowAddModal(!showAddModal);

  useEffect(() => {
    const query = [...defaultFilter];
    const queryOr = [...defaultOrFilter];

    if (textFilterContext && textFilterContext.value) {
      queryOr.push({ name: 'customerName', type: 'string', operator: 'contains', value: textFilterContext.value });
      queryOr.push({ name: 'customerEmail', type: 'string', operator: 'contains', value: textFilterContext.value });
      queryOr.push({ name: 'customerPhone', type: 'string', operator: 'contains', value: textFilterContext.value });
      queryOr.push({ name: 'customerCompany', type: 'string', operator: 'contains', value: textFilterContext.value });
      queryOr.push({ name: '_id', type: 'string', operator: 'contains', value: textFilterContext.value });
    } else {
      if (classFilterContext) {
        const filter = {
          name: 'classId',
          type: 'string',
          operator: 'contains',
          value: classFilterContext.value
        };
        query.push(filter);
      }

      if (dateFilterContext) {
        const filter = {
          name: 'createdAt',
          type: 'date',
          operator: 'inrange',
          value: {
            start: moment(dateFilterContext.value[0]).format(),
            end: moment(dateFilterContext.value[1]).add(23, 'hours').add(59, 'minutes').format()
          }
        };
        query.push(filter);
      }

      if (coordinatorFilterContext && coordinatorFilterContext.value) {
        const coordinators = coordinatorFilterContext.value;
        coordinators.forEach((coordinator) => {
          const filter = {
            name: 'eventCoordinatorId',
            type: 'string',
            operator: 'contains',
            value: coordinator
          };
          queryOr.push(filter);
        });
      }
    }

    setBookingsFilter(queryOr);
    setMainFilter(query);
  }, [classFilterContext, coordinatorFilterContext, dateFilterContext, textFilterContext]);

  const onEditCompleted = (bookingId) => {
    const currentFilters = [...bookingsFilter];
    currentFilters.push({ name: '_id', type: 'string', operator: 'eq', value: bookingId });
    currentFilters.push({ name: '_id', type: 'string', operator: 'neq', value: bookingId });
    setBookingsFilter(currentFilters);
  };

  const onAddCompleted = (bookingId) => {
    setTextFilterContext({ type: 'text', value: bookingId });
  };

  // ** Function to handle Modal toggle
  return (
    <>
      <BookingsHeader
        setShowFiltersModal={(val) => setShowFiltersModal(val)}
        showAddModal={() => handleModal()}
        setElementToAdd={(d) => setElementToAdd(d)}
        onChangeLimit={(newLimit) => {
          setLimit(newLimit);
        }}
        bookings={[]}
        customers={customers}
        coordinators={coordinators}
        isBooking
        classes={classes}
        calendarEvents={[]}
        defaultLimit={limit}
        showLimit={false}
        showExport={true}
        showAdd={true}
        showFilter={true}
        showView={false}
        titleView={'Bookings '}
        isInProgressBookings={true}
      />
      {allBookingsResultQuote.loading ||
      allBookingsResultRequested.loading ||
      allBookingsResultAccepted.loading ||
      allBookingsResultDeposit.loading ||
      allBookingsResultPaid.loading ? (
        <div>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </div>
      ) : (
        <>
          <BoardBookings
            filteredBookingsQuote={filteredBookingsQuote}
            filteredBookingsRequested={filteredBookingsRequested}
            filteredBookingsAccepted={filteredBookingsAccepted}
            filteredBookingsDeposit={filteredBookingsDeposit}
            filteredBookingsPaid={filteredBookingsPaid}
            handleEditModal={(element) => {
              setCurrentElement(element);
              handleEditModal();
            }}
          />

          <FiltersModal
            open={showFiltersModal}
            handleModal={() => setShowFiltersModal(!showFiltersModal)}
            classes={classes}
            coordinators={coordinators}
            isFilterByClass={true}
            isFilterByCoordinator={true}
            isFilterByCreationDate={true}
          />
          <AddNewBooking
            open={showAddModal}
            handleModal={handleModal}
            classes={classes}
            customers={customers}
            baseElement={elementToAdd}
            coordinators={coordinators}
            onAddCompleted={onAddCompleted}
          />
          <EditBookingModal
            open={editModal}
            handleModal={handleEditModal}
            currentElement={currentElement}
            allCoordinators={coordinators}
            allClasses={classes}
            handleClose={() => setCurrentElement({})}
            editMode={currentElement && currentElement.status !== 'closed' ? true : false}
            onEditCompleted={onEditCompleted}
          />
        </>
      )}
    </>
  );
};

export default BookingList;
