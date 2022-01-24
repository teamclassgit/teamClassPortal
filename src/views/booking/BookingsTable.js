// @packages
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { apolloClient } from '../../utility/RealmApolloClient';
import { Briefcase, Calendar, Check, DollarSign, Edit2, Mail, Phone, TrendingUp, User, Users } from 'react-feather';
import { Alert, Badge, Button, Card, CardBody, CardTitle, CardText, CardFooter, Col, Row } from 'reactstrap';
import Avatar from '@components/avatar';
import moment from 'moment';

//@reactdatagrid packages
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import '@inovua/reactdatagrid-enterprise/index.css';
import '@inovua/reactdatagrid-enterprise/theme/default-light.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-dark.css';
import './BookingsTable.scss';

// @scripts
import queryGetBookingsWithCriteria from '../../graphql/QueryGetBookingsWithCriteria';
import queryAllCustomers from '../../graphql/QueryAllCustomers';
import queryAllClasses from '../../graphql/QueryAllClasses';
import CopyClipboard from '../../components/CopyClipboard';
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators';
import queryAllCalendarEvents from '../../graphql/QueryAllCalendarEvents';
import EditBookingModal from '../../components/EditBookingModal';
import AddNewBooking from './AddNewBooking';
import BookingTableCards from './BookingsTableStatusCards';
import RowDetails from '../../components/RowDetails';
import { capitalizeString } from '../../utility/Utils';

const renderRowDetails = ({ data }) => {
  return data ? <RowDetails data={data} /> : <></>;
};

const onRenderRow = (rowProps) => {
  const depositPayment = rowProps.data.depositsPaid;
  const finalPayment = rowProps.data.finalPaid;
  const previousEventDays = moment(rowProps.data.eventDateTime).diff(moment(), 'days');

  if (depositPayment && rowProps.data.eventDateTime && !finalPayment) {
    if (previousEventDays < 0) {
      rowProps.style.backgroundColor = 'rgba(234,84,85,.12)';
    } else if (previousEventDays < 7 && previousEventDays >= 0) {
      rowProps.style.backgroundColor = 'rgba(255,159,67,.12)';
    }
  }
};

const DataGrid = () => {
  const skin = useSelector((state) => state.bookingsBackground);
  const genericFilter = {};
  const [gridRef, setGridRef] = useState(null);
  const [status, setStatus] = useState({ value: 'quote', label: 'Quote', calendarEventStatus: '' });
  const [editModal, setEditModal] = useState(false);
  const [currentElement, setCurrentElement] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [elementToAdd, setElementToAdd] = useState({});
  const [customers, setCustomers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [sortInfo, setSortInfo] = useState([]);
  const [filteredRows, setFilteredRows] = useState(null);
  const [expandedRows, setExpandedRows] = useState({ 1: true, 2: true });
  const [collapsedRows, setCollapsedRows] = useState(null);
  const [cellSelection, setCellSelection] = useState({});

  const handleModal = () => setShowAddModal(!showAddModal);

  const handleEditModal = () => {
    setEditModal(!editModal);
  };

  const history = useHistory();

  console.log('status', status);
  console.log('currentElement', currentElement);

  const handleEdit = (rowId) => {
    history.push(`/booking/${rowId}`);
  };

  const columns = [
    {
      name: 'createdAt',
      header: 'Created',
      type: 'date',
      filterEditor: DateFilter,
      render: ({ value, cellProps }) => {
        return moment(value).calendar(null, {
          lastDay: '[Yesterday]',
          sameDay: 'LT',
          lastWeek: 'dddd',
          sameElse: 'MMMM Do, YYYY'
        });
      }
    },
    {
      name: 'updatedAt',
      header: 'Updated',
      type: 'date',
      filterEditor: DateFilter,
      render: ({ value, cellProps }) => {
        return moment(value).calendar(null, {
          lastDay: '[Yesterday]',
          sameDay: 'LT',
          lastWeek: 'dddd',
          sameElse: 'MMMM Do, YYYY'
        });
      },
      defaultVisible: false
    },
    {
      name: '_id',
      header: 'Id',
      type: 'string',
      render: ({ value, cellProps }) => {
        return (
          <>
            <small>
              <a
                href="#"
                onClick={() => {
                  console.log('entró handle modal fila', value);
                  const payments = [];
                  setCurrentElement({
                    bookingId: value,
                    currentCustomerId: cellProps.data.customerId,
                    currentName: cellProps.data.customerName,
                    currentEmail: cellProps.data.customerEmail,
                    currentPhone: cellProps.data.customerPhone,
                    currentCompany: cellProps.data.customerCompany,
                    currentCoordinatorId: cellProps.data.eventCoordinatorId,
                    currentCoordinatorName: cellProps.data.eventCoordinatorName,
                    currentTeamclassId: cellProps.data.classId,
                    currentTeamclassName: cellProps.data.className,
                    currentGroupSize: cellProps.data.attendees,
                    currentSignUpDeadline: cellProps.data.signUpDeadline,
                    currentClassVariant: cellProps.data.classVariant,
                    currentServiceFee: cellProps.data.serviceFeeAmount,
                    currentSalesTax: cellProps.data.taxAmount,
                    createdAt: cellProps.data.createdAt,
                    updatedAt: cellProps.data.updatedAt,
                    currentStatus: cellProps.data.status,
                    currentEventDurationHours: cellProps.data.eventDurationHours,
                    currentClosedReason: cellProps.data.closedReason,
                    currentNotes: cellProps.data.notes,
                    currentPayments: cellProps.data.payments,
                    currentCapRegistration: cellProps.data.capRegistration
                  });
                  handleEditModal();
                }}
                title={`Edit booking info ${cellProps.data._id}`}
              >
                {cellProps.data._id}
              </a>
            </small>
          </>
        );
      }
    },
    { name: 'customerName', header: 'Customer ', type: 'string' },
    { name: 'customerEmail', header: 'Email ', type: 'string' },
    { name: 'customerPhone', header: 'Phone ', type: 'number', defaultVisible: false },
    { name: 'customerCompany', header: 'Company ', type: 'string' },
    { name: 'className', header: 'Class ', type: 'string' },
    {
      name: 'attendees',
      header: 'Attendees ',
      type: 'number',
      filterEditor: NumberFilter,
      defaultWidth: 112,
      render: ({ value, cellProps }) => {
        if (value) {
          return <span className="float-right">{value}</span>;
        }
      }
    },
    {
      name: 'eventDateTime',
      header: 'Event date',
      type: 'date',
      filterEditor: DateFilter,
      render: ({ value, cellProps }) => {
        if (value) {
          return moment(value).format('LLL');
        }
      }
    },
    {
      name: 'signUpDeadline',
      header: 'Sign Up Date',
      type: 'date',
      filterEditor: DateFilter,
      render: ({ value, cellProps }) => {
        if (value) {
          return moment(value).format('LLL');
        }
      }
    },
    {
      name: 'taxAmount',
      header: 'Tax',
      type: 'number',
      defaultWidth: 100,
      filterEditor: NumberFilter,
      render: ({ value, cellProps }) => {
        return value.toFixed(2);
      }
    },
    {
      name: 'serviceFeeAmount',
      header: 'Service Fee',
      type: 'number',
      defaultWidth: 100,
      filterEditor: NumberFilter,
      render: ({ value, cellProps }) => {
        return value.toFixed(2);
      }
    },
    {
      name: 'cardFeeAmount',
      header: 'Card Fee',
      type: 'number',
      defaultWidth: 100,
      filterEditor: NumberFilter,
      render: ({ value, cellProps }) => {
        return value.toFixed(2);
      }
    },
    {
      name: 'totalInvoice',
      header: 'Total Invoice',
      type: 'number',
      defaultWidth: 100,
      filterEditor: NumberFilter,
      render: ({ value, cellProps }) => {
        return value.toFixed(2);
      }
    },
    {
      name: 'depositsPaid',
      header: 'Deposit Paid',
      type: 'number',
      defaultWidth: 100,
      filterEditor: NumberFilter,
      defaultVisible: false,
      render: ({ value, cellProps }) => {
        return value.toFixed(2);
      }
    },
    {
      name: 'finalPaid',
      header: 'Final paid',
      type: 'number',
      defaultWidth: 100,
      filterEditor: NumberFilter,
      defaultVisible: false,
      render: ({ value, cellProps }) => {
        return value.toFixed(2);
      }
    },
    {
      name: 'balance',
      header: 'Balance',
      type: 'number',
      defaultWidth: 100,
      filterEditor: NumberFilter,
      defaultVisible: false,
      render: ({ value, cellProps }) => {
        return value.toFixed(2);
      }
    },
    {
      name: 'actions',
      header: 'Actions',
      defaultWidth: 200,
      render: ({ value, cellProps }) => {
        if (cellProps.data) {
          return cellProps.data.status === 'quote' ? (
            <small>
              <div className="d-flex">
                <a
                  className="mr-1"
                  href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                  target={'_blank'}
                  title={'Select date and time link'}
                >
                  <Avatar color="light-primary" size="sm" icon={<Calendar />} />
                </a>
                <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                  <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
                </a>
              </div>
            </small>
          ) : cellProps.data.status === 'date-requested' &&
            cellProps.data.eventDateTimeStatus &&
            cellProps.data.eventDateTimeStatus === 'reserved' ? (
              <small>
                <div className="d-flex">
                  <a
                    className="mr-1"
                    href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                    target={'_blank'}
                    title={'Select date and time link'}
                  >
                    <Avatar color="light-primary" size="sm" icon={<Calendar />} />
                  </a>
                  <a
                    className="mr-1"
                    href={`https://www.teamclass.com/booking/date-time-confirmation/${cellProps.data._id}`}
                    target={'_blank'}
                    title={'Approve/Reject link'}
                  >
                    <Avatar color="light-primary" size="sm" icon={<Check />} />
                  </a>
                  <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                    <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
                  </a>
                </div>
              </small>
            ) : cellProps.data.status === 'date-requested' &&
            cellProps.data.eventDateTimeStatus &&
            cellProps.data.eventDateTimeStatus === 'confirmed' ? (
                <small>
                  <div className="d-flex">
                    <a
                      className="mr-1"
                      href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                      target={'_blank'}
                      title={'Select date and time link'}
                    >
                      <Avatar color="light-primary" size="sm" icon={<Calendar />} />
                    </a>
                    <a
                      className="mr-1"
                      href={`https://www.teamclass.com/booking/event-confirmation/${cellProps.data._id}`}
                      target={'_blank'}
                      title={'Deposit link'}
                    >
                      <Avatar color="light-primary" size="sm" icon={<DollarSign />} />
                    </a>
                    <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                      <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
                    </a>
                  </div>
                </small>
              ) : cellProps.data.status === 'date-requested' &&
            cellProps.data.eventDateTimeStatus &&
            cellProps.data.eventDateTimeStatus === 'rejected' ? (
                  <small>
                    <div className="d-flex">
                      <a
                        className="mr-1"
                        href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                        target={'_blank'}
                        title={'Select date and time link'}
                      >
                        <Avatar color="light-primary" size="sm" icon={<Calendar />} />
                      </a>
                      <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} title={'Time / Attendees / Invoice Builder'}>
                        <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
                      </a>
                    </div>
                  </small>
                ) : cellProps.data.status === 'confirmed' ? (
                  <small>
                    <div className="d-flex">
                      <a
                        className="mr-1"
                        href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                        target={'_blank'}
                        title={'Select date and time link'}
                      >
                        <Avatar color="light-primary" size="sm" icon={<Calendar />} />
                      </a>
                      <a className="mr-1" href={`https://www.teamclass.com/event/${cellProps.data._id}`} target={'_blank'} title={'Sign-up link'}>
                        <Avatar color="light-primary" size="sm" icon={<User />} />
                      </a>
                      <a className="mr-1" href={`https://www.teamclass.com/signUpStatus/${cellProps.data._id}`} target={'_blank'} title={'Sign-up status'}>
                        <Avatar color="light-primary" size="sm" icon={<Users />} />
                      </a>
                      <a
                        className="mr-1"
                        href={`https://www.teamclass.com/booking/payment/${cellProps.data._id}`}
                        target={'_blank'}
                        title={'Final payment link'}
                      >
                        <Avatar color="secondary" size="sm" icon={<DollarSign />} />
                      </a>
                      <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                        <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
                      </a>
                    </div>
                  </small>
                ) : (
                  cellProps.data.status === 'paid' && (
                    <small>
                      <div className="d-flex">
                        <a
                          className="mr-1"
                          href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                          target={'_blank'}
                          title={'Select date and time link'}
                        >
                          <Avatar color="light-primary" size="sm" icon={<Calendar />} />
                        </a>
                        <a className="mr-1" href={`https://www.teamclass.com/event/${cellProps.data._id}`} target={'_blank'} title={'Sign-up link'}>
                          <Avatar color="light-primary" size="sm" icon={<User />} />
                        </a>
                        <a
                          className="mr-1"
                          href={`https://www.teamclass.com/signUpStatus/${cellProps.data._id}`}
                          target={'_blank'}
                          title={'Sign-up status'}
                        >
                          <Avatar color="light-primary" size="sm" icon={<Users />} />
                        </a>
                        <a
                          className="mr-1"
                          href={`https://www.teamclass.com/booking/payment/${cellProps.data._id}`}
                          target={'_blank'}
                          title={'Final payment link'}
                        >
                          <Avatar color="secondary" size="sm" icon={<DollarSign />} />
                        </a>
                        <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                          <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
                        </a>
                      </div>
                    </small>
                  )
                );
        }
      }
    }
  ];

  const [getCalendarEvents, { ...allCalendarEventsResults }] = useLazyQuery(queryAllCalendarEvents, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data) {
        setCalendarEvents(data.calendarEvents);
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

  const { ...allCoordinatorResult } = useQuery(queryAllCoordinators, {
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) setCoordinators(data.eventCoordinators);
    },
    pollInterval: 200000
  });

  const gridStyle = { minHeight: 600, marginTop: 10 };

  useEffect(() => {
    if (gridRef) gridRef.current.clearAllFilters();

    const defaultFilterValue = [
      { name: 'createdAt', type: 'date', operator: 'before', value: undefined },
      { name: 'updatedAt', type: 'date', operator: 'before', value: undefined },
      { name: '_id', type: 'string', operator: 'contains', value: '' },
      { name: 'customerName', type: 'string', operator: 'contains', value: '' },
      { name: 'customerEmail', type: 'string', operator: 'contains', value: '' },
      { name: 'customerPhone', type: 'string', operator: 'contains', value: '' },
      { name: 'customerCompany', type: 'string', operator: 'contains', value: '' },
      { name: 'className', type: 'string', operator: 'contains', value: '' },
      { name: 'attendees', type: 'number', operator: 'gte', value: undefined },
      { name: 'eventDateTime', type: 'date', operator: 'before', value: undefined },
      { name: 'status', type: 'string', operator: 'contains', value: status?.value }
    ];

    if (status && status.calendarEventStatus) {
      defaultFilterValue.push({ name: 'eventDateTimeStatus', type: 'string', operator: 'contains', value: status.calendarEventStatus });
    }

    setFilterValue(defaultFilterValue);
  }, [status]);

  const loadData = ({ skip, limit, sortInfo, filterValue }) => {
    if (!filterValue) filterValue = [];

    console.log('limit', limit);
    console.log('sortInfo', sortInfo);
    console.log('filterValue', filterValue);

    const filters = filterValue
      .filter(
        (item) => (item.operator !== 'inrange' && item.operator !== 'notinrange' && item.value && item.value !== '') ||
          ((item.operator === 'inrange' || item.operator === 'notinrange') &&
            item.value?.start &&
            item.value?.start !== '' &&
            item.value?.end &&
            item.value?.end !== '')
      )
      .map(({ name, type, operator, value }) => {
        if (type === 'number' && (operator === 'inrange' || operator === 'notinrange')) return { name, type, operator, valueRangeNum: value };
        if (type === 'date' && (operator === 'inrange' || operator === 'notinrange')) return { name, type, operator, valueRange: value };
        if (type === 'number') return { name, type, operator, valueNum: value };
        return { name, type, operator, value };
      });

    //filters.push();

    console.log('filters', filters);
    return apolloClient
      .query({
        query: queryGetBookingsWithCriteria,
        variables: {
          limit,
          offset: skip,
          sortBy: sortInfo,
          filterBy: filters
        }
      })
      .then((response) => {
        console.log('entró', response);
        const totalCount = response.data.getBookingsWithCriteria.count;
        return { data: response.data.getBookingsWithCriteria.rows, count: totalCount };
      });
    // return { data: [], count: 0 };
  };

  const dataSource = useCallback(loadData, []);

  const onExpandedRowsChange = useCallback(({ expandedRows, collapsedRows }) => {
    setExpandedRows(expandedRows);
    setCollapsedRows(collapsedRows);
  }, []);

  const onCopySelectedCellsChange = useCallback((cells) => {
    console.log(cells);
  }, []);

  const onPasteSelectedCellsChange = useCallback((cells) => {
    console.log(cells);
  }, []);

  return (
    <div>
      <BookingTableCards setStatus={setStatus} />
      <div className="datatable">
        <div className="d-flex justify-content-between ">
          <h4 className="mb-2">
            Bookings <Badge color="light-primary">{status.label}</Badge>
          </h4>
          <Button
            onClick={(e) => {
              const newElement = {
                name: '',
                email: '',
                phone: '',
                company: '',
                attendees: ''
              };
              setElementToAdd(newElement);
              handleModal();
            }}
            color="primary"
            outline
            size="sm"
          >
            Add booking
          </Button>
        </div>

        <ReactDataGrid
          idProperty="_id"
          onReady={setGridRef}
          className="bookings-table text-small"
          style={gridStyle}
          columns={columns}
          filteredRowsCount={setFilteredRows}
          filterValue={filterValue}
          pagination
          livePagination
          dataSource={dataSource}
          onSortInfoChange={setSortInfo}
          onFilterValueChange={setFilterValue}
          showZebraRows={true}
          theme={skin === 'dark' ? 'amber-dark' : 'default-light'}
          cellSelection={cellSelection}
          onCellSelectionChange={setCellSelection}
          enableClipboard={true}
          onCopySelectedCellsChange={onCopySelectedCellsChange}
          onPasteSelectedCellsChange={onPasteSelectedCellsChange}
          expandedRows={expandedRows}
          collapsedRows={collapsedRows}
          onExpandedRowsChange={onExpandedRowsChange}
          onRenderRow={onRenderRow}
          rowExpandHeight={370}
          renderRowDetails={renderRowDetails}
        />
        <AddNewBooking
          open={showAddModal}
          handleModal={handleModal}
          bookings={[]}
          classes={classes}
          setCustomers={setCustomers}
          customers={customers}
          baseElement={elementToAdd}
          // setBookings={setBookings}
          coordinators={coordinators}
        />
        <EditBookingModal
          open={editModal}
          handleModal={handleEditModal}
          currentElement={currentElement}
          allCoordinators={coordinators}
          allClasses={classes}
          allBookings={[]}
          allCustomers={customers}
          allCalendarEvents={calendarEvents}
          // setBookings={setBookings}
          setCustomers={setCustomers}
          handleClose={() => setCurrentElement({})}
          editMode={true}
        />
      </div>
    </div>
  );
};

export default DataGrid;

ReactDataGrid.defaultProps.filterTypes.string = {
  type: 'string',
  emptyValue: '',
  operators: [
    {
      name: 'contains',
      fn: {}
    }
  ]
};
