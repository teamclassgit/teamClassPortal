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
import columns from './BookingsTableColumns';
import { capitalizeString } from '../../utility/Utils';

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
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertColor, setAlertColor] = useState(null);
  const [rowBookingId, setRowBookingId] = useState(null);
  const [rowDepositPayment, setRowDepositPayment] = useState(null);
  const [rowFinalPayment, setRowFinalPayment] = useState(null);
  const [rowEventDate, setRowEventDate] = useState(null);

  const handleModal = () => setShowAddModal(!showAddModal);

  const handleEditModal = (element) => {
    console.log('element', element);
    setEditModal(!editModal);
    setCurrentElement(element);
  };

  const history = useHistory();

  console.log('status', status);

  const handleEdit = (rowId) => {
    history.push(`/booking/${rowId}`);
  };

  const renderRowDetails = ({ data }) => {
    console.log('data', data);
    setRowBookingId(data._id);
    setRowDepositPayment(data.depositsPaid);
    setRowFinalPayment(data.finalPaid);
    setRowEventDate(data.eventDateTime);
    return (
      <div style={{ padding: 20 }}>
        <h4 className="mb-1">{capitalizeString(data.customerName)}</h4>
        <table>
          <tbody>
            {alertMessage && (
              <tr>
                <td>
                  <Alert color={alertColor}>{alertMessage}</Alert>
                </td>
              </tr>
            )}
            <tr>
              <td>Phone</td>
              <td>
                <Phone size={16} /> {data.customerPhone} <CopyClipboard text={data.customerPhone} />
              </td>
            </tr>
            <tr>
              <td>Email</td>
              <td>
                <Mail size={16} /> {data.customerEmail} <CopyClipboard className="z-index-2" text={data.customerEmail} />
              </td>
            </tr>
            {data.customerCompany && (
              <tr>
                <td>Company</td>
                <td>
                  <Briefcase size={16} /> {data.customerCompany}
                </td>
              </tr>
            )}
            <tr>
              <td>
                <strong>Booking ID</strong>
              </td>
              <td>{data._id}</td> <CopyClipboard className="z-index-2" text={data._id} />
            </tr>
            <tr>
              <td>Class:</td>
              <td>{data.className}</td>
            </tr>
            <tr>
              {data.classVariant && (
                <>
                  <td>Option</td>
                  <td>
                    {data.classVariant.title} {`$${data.classVariant.pricePerson}`} {data.classVariant.groupEvent ? '/group' : '/person'}
                  </td>
                </>
              )}
            </tr>
            <tr>
              <td>Event Date</td>
              <td>
                <Calendar size={16} /> {data.eventDateTime ? moment(data.eventDateTime).format('LLL') : 'TBD'}
              </td>
            </tr>
            <tr>
              <td>Attendees</td>
              <td>{data.attendees}</td>
            </tr>
            <tr>
              <td>International attendees</td>
              <td>{data.hasInternationalAttendees ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td>Created</td>
              <td>{moment(data.createdAt).format('LL')}</td>
            </tr>
            <tr>
              <td>Updated</td>
              <td>{moment(data.updatedAt).format('LL')}</td>
            </tr>
            <tr>
              <td>Sign Up Date</td>
              <td>{data.signUpDeadline && moment(data.signUpDeadline).format('LL')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

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

  const onRenderRow = (rowProps) => {
    // console.log('rowProps', rowProps);

    const depositPayment = rowProps.data.depositsPaid;
    const finalPayment = rowProps.data.finalPaid;
    const previousEventDays = moment(rowProps.data.eventDateTime).diff(moment(), 'days');

    if (depositPayment && rowProps.data.eventDateTime && !finalPayment) {
      if (previousEventDays < 0) {
        rowProps.style.color = '#ea5455';
      } else if (previousEventDays < 7 && previousEventDays >= 0) {
        rowProps.style.color = '#ff9f43';
      }
    }
  };

  useEffect(() => {
    const previousEventDays = moment(rowEventDate).diff(moment(), 'days');
    console.log('previousEventDays', previousEventDays);

    if (rowDepositPayment && rowEventDate && !rowFinalPayment) {
      if (previousEventDays < 0) {
        console.log('condición roja');
        setAlertMessage(`Booking has not been paid and event was ${previousEventDays * -1} days ago.`);
        setAlertColor('danger');
      } else if (previousEventDays < 7 && previousEventDays >= 0) {
        setAlertMessage(
          `Booking has not been paid and event is in ${
            moment(rowEventDate).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY') ? 0 : previousEventDays + 1
          } days.`
        );
        setAlertColor('warning');
      } else {
        setAlertMessage(null);
      }
    }
  }, [rowBookingId]);

  console.log('alertMessage', alertMessage);
  console.log('rowBookingId', rowBookingId);
  console.log('rowDepositPayment', rowDepositPayment);
  console.log('rowFinalPayment', rowFinalPayment);
  console.log('rowEventDate', rowEventDate);

  useEffect(() => {
    if (gridRef) gridRef.current.clearAllFilters();

    console.log('USEEFFECT');

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
