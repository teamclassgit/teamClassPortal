// @packages
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { apolloClient } from '../../utility/RealmApolloClient';
import { Calendar, Check, DollarSign, Edit2, User, Users } from 'react-feather';
import Avatar from '@components/avatar';
import moment from 'moment';
window.moment = moment;
import { getQueryFiltersFromFilterArray, getUserData } from '../../utility/Utils';

//@reactdatagrid packages
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import StringFilter from '@inovua/reactdatagrid-community/StringFilter';
import '@inovua/reactdatagrid-enterprise/index.css';
import '@inovua/reactdatagrid-enterprise/theme/default-light.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-dark.css';
import './BookingsTable.scss';

// @scripts
import queryGetBookingsWithCriteria from '../../graphql/QueryGetBookingsWithCriteria';
import queryAllClasses from '../../graphql/QueryAllClasses';
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators';
import queryAllCustomers from '../../graphql/QueryAllCustomers';
import EditBookingModal from '../../components/EditBookingModal';
import AddNewBooking from '../../components/AddNewBooking';
import RowDetails from '../../components/BookingTableRowDetails';
import TasksBar from '../../components/TasksBar';

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

const AllBookingsTable = () => {
  const skin = useSelector((state) => state.bookingsBackground);
  const genericFilter = {};
  const [gridRef, setGridRef] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [currentElement, setCurrentElement] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [elementToAdd, setElementToAdd] = useState({});
  const [customers, setCustomers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [sortInfo, setSortInfo] = useState({ dir: -1, id: 'createdAt', name: 'createdAt', type: 'date' });
  const [filteredRows, setFilteredRows] = useState(null);
  const [expandedRows, setExpandedRows] = useState({ 1: true, 2: true });
  const [collapsedRows, setCollapsedRows] = useState(null);
  const [cellSelection, setCellSelection] = useState({});

  const handleModal = () => setShowAddModal(!showAddModal);

  const handleEditModal = () => {
    setEditModal(!editModal);
  };

  const history = useHistory();

  const handleEdit = (rowId) => {
    history.push(`/booking/${rowId}`);
  };

  const columns = [
    {
      name: '_id',
      header: 'Id',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      width: 200,
      render: ({ value, cellProps }) => {
        return (
          <>
            <small>
              <a
                href="#"
                onClick={() => {
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
    {
      name: 'createdAt',
      header: 'Created',
      type: 'date',
      width: 250,
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
      name: 'eventDateTime',
      header: 'Event date',
      type: 'date',
      width: 250,
      filterEditor: DateFilter,
      render: ({ value, cellProps }) => {
        if (value) {
          return moment(value).format('LLL');
        }
      }
    },

    {
      name: 'bookingStage',
      header: 'Stage ',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value, cellProps }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: 'updatedAt',
      header: 'Updated',
      type: 'date',
      width: 250,
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

    { name: 'customerName', header: 'Customer ', type: 'string', filterEditor: StringFilter, filterDelay: 1500 },
    { name: 'customerEmail', header: 'Email ', type: 'string', filterEditor: StringFilter, filterDelay: 1500 },
    { name: 'customerPhone', header: 'Phone ', type: 'number', defaultVisible: false, filterEditor: StringFilter, filterDelay: 1500 },
    { name: 'customerCompany', header: 'Company ', type: 'string', filterEditor: StringFilter, filterDelay: 1500 },
    { name: 'className', header: 'Class ', type: 'string', filterEditor: StringFilter, filterDelay: 1500 },
    {
      name: 'eventCoordinatorName',
      header: 'Coordinator Name',
      type: 'string',
      defaultVisible: false,
      filterEditor: StringFilter,
      filterDelay: 1500
    },
    { name: 'eventCoordinatorEmail', header: 'Coordinator', type: 'string', filterEditor: StringFilter, filterDelay: 1500 },
    {
      name: 'attendees',
      header: 'Attendees ',
      type: 'number',
      filterEditor: NumberFilter,
      filterDelay: 1500,
      defaultWidth: 112,
      render: ({ value, cellProps }) => {
        if (value) {
          return <span className="float-right">{value}</span>;
        }
      }
    },
    {
      name: 'signUpDeadline',
      header: 'Registration',
      type: 'date',
      width: 250,
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
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      defaultVisible: false,
      render: ({ value, cellProps }) => {
        return <span className="float-right">${value.toFixed(2)}</span>;
      }
    },
    {
      name: 'serviceFeeAmount',
      header: 'Service Fee',
      type: 'number',
      defaultWidth: 150,
      defaultVisible: false,
      filterDelay: 1500,
      filterEditor: NumberFilter,
      render: ({ value, cellProps }) => {
        return <span className="float-right">${value.toFixed(2)}</span>;
      }
    },
    {
      name: 'cardFeeAmount',
      header: 'Card Fee',
      type: 'number',
      defaultWidth: 150,
      defaultVisible: false,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value, cellProps }) => {
        return <span className="float-right">${value.toFixed(2)}</span>;
      }
    },
    {
      name: 'totalInvoice',
      header: 'Total',
      type: 'number',
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value, cellProps }) => {
        return <span className="float-right">${value.toFixed(2)}</span>;
      }
    },
    {
      name: 'depositsPaid',
      header: 'Deposits',
      type: 'number',
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value, cellProps }) => {
        return <span className="float-right">${value.toFixed(2)}</span>;
      }
    },
    {
      name: 'finalPaid',
      header: 'Final paid',
      type: 'number',
      defaultWidth: 150,
      filterEditor: NumberFilter,
      render: ({ value, cellProps }) => {
        return <span className="float-right">${value.toFixed(2)}</span>;
      }
    },
    {
      name: 'balance',
      header: 'Balance',
      type: 'number',
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value, cellProps }) => {
        return <span className="float-right">${value.toFixed(2)}</span>;
      }
    },
    {
      name: 'closedReason',
      header: 'Closed Reason ',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value, cellProps }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: 'actions',
      header: 'Links',
      defaultWidth: 220,
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
          ) : cellProps.data.status === 'closed' ? (
            <small>
              <div className="d-flex">
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

  const { ...allClasses } = useQuery(queryAllClasses, {
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data && data.teamClasses) {
        setClasses(data.teamClasses);
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
    fetchPolicy: 'cache-and-network'
  });

  const { ...allCustomersResult } = useQuery(queryAllCustomers, {
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) setCustomers(data.customers);
    },
    pollInterval: 200000
  });

  const gridStyle = { minHeight: 600, marginTop: 10 };

  useEffect(() => {
    let currentFilters = [...filterValue];

    if (currentFilters && currentFilters.length === 0) {
      const userData = getUserData();
      let coordinatorFilterValue = '';

      if (userData && userData.customData && userData.customData.coordinatorId) {
        coordinatorFilterValue = userData.customData.email;
      }

      currentFilters = [
        { name: 'createdAt', type: 'date', operator: 'inrange', value: undefined },
        { name: 'updatedAt', type: 'date', operator: 'inrange', value: undefined },
        { name: '_id', type: 'string', operator: 'contains', value: '' },
        { name: 'customerName', type: 'string', operator: 'contains', value: '' },
        { name: 'bookingStage', type: 'string', operator: 'contains', value: '' },
        { name: 'closedReason', type: 'string', operator: 'contains', value: '' },
        { name: 'customerEmail', type: 'string', operator: 'contains', value: '' },
        { name: 'customerPhone', type: 'string', operator: 'contains', value: '' },
        { name: 'customerCompany', type: 'string', operator: 'contains', value: '' },
        { name: 'eventCoordinatorName', type: 'string', operator: 'contains', value: '' },
        { name: 'eventCoordinatorEmail', type: 'string', operator: 'contains', value: coordinatorFilterValue },
        { name: 'className', type: 'string', operator: 'contains', value: '' },
        { name: 'attendees', type: 'number', operator: 'gte', value: undefined },
        { name: 'taxAmount', type: 'number', operator: 'gte', value: undefined },
        { name: 'serviceFeeAmount', type: 'number', operator: 'gte', value: undefined },
        { name: 'cardFeeAmount', type: 'number', operator: 'gte', value: undefined },
        { name: 'totalInvoice', type: 'number', operator: 'gte', value: undefined },
        { name: 'depositsPaid', type: 'number', operator: 'gte', value: undefined },
        { name: 'finalPaid', type: 'number', operator: 'gte', value: undefined },
        { name: 'balance', type: 'number', operator: 'gte', value: undefined },
        { name: 'eventDateTime', type: 'date', operator: 'inrange', value: undefined },
        { name: 'signUpDeadline', type: 'date', operator: 'inrange', value: undefined }
      ];
    }

    setFilterValue(currentFilters);
  }, []);

  const onEditCompleted = () => {
    const sortEditedData = { dir: -1, id: 'updatedAt', name: 'updatedAt', type: 'date' };
    setSortInfo(sortEditedData);
  };

  const onAddCompleted = () => {
    const sortAddedData = { dir: -1, id: 'createdAt', name: 'createdAt', type: 'date' };
    setSortInfo(sortAddedData);
  };

  const loadData = async ({ skip, limit, sortInfo, filterValue }) => {
    const filters = getQueryFiltersFromFilterArray(filterValue);
    console.log('filters', filters);

    const response = await apolloClient.query({
      query: queryGetBookingsWithCriteria,
      variables: {
        limit,
        offset: skip,
        sortBy: sortInfo,
        filterBy: filters
      }
    });
    const totalCount = response.data.getBookingsWithCriteria.count;
    setTotalRows(totalCount);
    return { data: response.data.getBookingsWithCriteria.rows, count: totalCount };
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
      <TasksBar
        setElementToAdd={setElementToAdd}
        titleView={'ALL Time Bookings (Beta)'}
        titleBadge={` ${totalRows} records found`}
        showAddModal={() => handleModal()}
      ></TasksBar>
      <ReactDataGrid
        idProperty="_id"
        onReady={setGridRef}
        className="bookings-table text-small"
        style={gridStyle}
        columns={columns}
        filteredRowsCount={setFilteredRows}
        filterValue={filterValue}
        pagination
        limit={50}
        livePagination
        dataSource={dataSource}
        sortInfo={sortInfo}
        onSortInfoChange={setSortInfo}
        onFilterValueChange={setFilterValue}
        showZebraRows={true}
        theme={skin === 'dark' ? 'amber-dark' : 'default-light'}
        /*cellSelection={cellSelection}
        onCellSelectionChange={setCellSelection}
        enableClipboard={true}
        onCopySelectedCellsChange={onCopySelectedCellsChange}
        onPasteSelectedCellsChange={onPasteSelectedCellsChange}*/
        expandedRows={expandedRows}
        collapsedRows={collapsedRows}
        onExpandedRowsChange={onExpandedRowsChange}
        onRenderRow={onRenderRow}
        rowExpandHeight={400}
        renderRowDetails={renderRowDetails}
        licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
      />
      <AddNewBooking
        open={showAddModal}
        handleModal={handleModal}
        bookings={[]}
        classes={classes}
        setCustomers={setCustomers}
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
        allBookings={[]}
        allCustomers={customers}
        setCustomers={setCustomers}
        handleClose={() => setCurrentElement({})}
        editMode={currentElement && currentElement.currentStatus !== 'closed' ? true : false}
        onEditCompleted={onEditCompleted}
      />
    </div>
  );
};

export default AllBookingsTable;

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
