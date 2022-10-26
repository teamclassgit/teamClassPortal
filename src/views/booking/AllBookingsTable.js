// @packages
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { apolloClient } from '../../utility/RealmApolloClient';
import { Calendar, Check, DollarSign, Edit2, User, Users } from 'react-feather';
import Avatar from '@components/avatar';
import moment from 'moment-timezone';
window.moment = moment;
import { getQueryFiltersFromFilterArray, getUserData, isNotEmptyArray } from '../../utility/Utils';
import { Modal } from 'reactstrap';

//@reactdatagrid packages
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import StringFilter from '@inovua/reactdatagrid-community/StringFilter';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import '@inovua/reactdatagrid-enterprise/index.css';
import '@inovua/reactdatagrid-enterprise/theme/default-light.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-dark.css';
import './BookingsTable.scss';

// @scripts
import queryGetBookingsWithCriteria from '../../graphql/QueryGetBookingsWithCriteria';
import queryAllClasses from '../../graphql/QueryAllClasses';
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators';
import queryAllCustomers from '../../graphql/QueryAllCustomers';
import queryAllInstructors from '../../graphql/QueryAllInstructors';
import EditBookingModal from '../../components/EditBookingModal';
import AddNewBooking from '../../components/AddNewBooking';
import RowDetails from '../../components/BookingTableRowDetails';
import TasksBar from '../../components/TasksBar';
import { getAllDataToExport, getBookingAndCalendarEventById } from '../../services/BookingService';
import ConfirmBookingsToClose from '../../components/ConfirmBookingsToClose';
import { DEFAULT_TIME_ZONE_LABEL } from '../../utility/Constants';

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
  const [instructors, setInstructors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [orFilters, setOrFilters] = useState([]);
  const [sortInfo, setSortInfo] = useState({ dir: -1, id: 'createdAt', name: 'createdAt', type: 'date' });
  const [filteredRows, setFilteredRows] = useState(null);
  const [expandedRows, setExpandedRows] = useState({ 1: true, 2: true });
  const [collapsedRows, setCollapsedRows] = useState(null);
  const [cellSelection, setCellSelection] = useState({});
  const [selected, setSelected] = useState({});
  const [closedReason, setClosedReason] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModal = () => setShowAddModal(!showAddModal);

  const handleEditModal = () => {
    setEditModal(!editModal);
  };

  const history = useHistory();

  const handleEdit = (rowId) => {
    history.push(`/booking/${rowId}`);
  };

  const toggle = () => {
    if (isOpenModal) {
      setSortInfo({ dir: 1, id: 'createdAt', name: 'createdAt', type: 'date' });
    }
    setSortInfo({ dir: -1, id: 'createdAt', name: 'createdAt', type: 'date' });
    setIsOpenModal(!isOpenModal);
  };

  const columns = [
    {
      name: 'actions',
      header: 'Links',
      defaultWidth: 200,
      render: ({ value, cellProps }) => {
        if (cellProps.data) {
          return cellProps.data.status === 'quote' ? (
            <small>
              <div className="d-flex">
                <a
                  className="mr-1"
                  href={`https://www.teamclass.com/customers/select-date-time/${cellProps.data._id}`}
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
                  href={`https://www.teamclass.com/customers/select-date-time/${cellProps.data._id}`}
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
                  href={`https://www.teamclass.com/customers/select-date-time/${cellProps.data._id}`}
                  target={'_blank'}
                  title={'Select date and time link'}
                >
                  <Avatar color="light-primary" size="sm" icon={<Calendar />} />
                </a>
                <a
                  className="mr-1"
                  href={`https://www.teamclass.com/customers/events/${cellProps.data._id}?type=payment`}
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
                  href={`https://www.teamclass.com/customers/select-date-time/${cellProps.data._id}`}
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
                  href={`https://www.teamclass.com/customers/select-date-time/${cellProps.data._id}`}
                  target={'_blank'}
                  title={'Select date and time link'}
                >
                  <Avatar color="light-primary" size="sm" icon={<Calendar />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/event/${cellProps.data._id}`} target={'_blank'} title={'Sign-up link'}>
                  <Avatar color="light-primary" size="sm" icon={<User />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/customers/events/${cellProps.data._id}?type=registration`} target={'_blank'} title={'Sign-up status'}>
                  <Avatar color="light-primary" size="sm" icon={<Users />} />
                </a>
                <a
                  className="mr-1"
                  href={`https://www.teamclass.com/customers/events/${cellProps.data._id}?type=payment`}
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
                    href={`https://www.teamclass.com/customers/select-date-time/${cellProps.data._id}`}
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
                    href={`https://www.teamclass.com/customers/events/${cellProps.data._id}?type=registration`}
                    target={'_blank'}
                    title={'Sign-up status'}
                  >
                    <Avatar color="light-primary" size="sm" icon={<Users />} />
                  </a>
                  <a
                    className="mr-1"
                    href={`https://www.teamclass.com/customers/events/${cellProps.data._id}?type=payment`}
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
    },
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
                onClick={async () => {
                  setOrFilters([]);
                  setSortInfo({ dir: -1, id: 'createdAt', name: 'createdAt', type: 'date' });
                  const bookingAndCalendarEvent = await getBookingAndCalendarEventById(value);
                  if (!bookingAndCalendarEvent) return;
                  setCurrentElement(bookingAndCalendarEvent);
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
          return `${moment(value)?.tz(cellProps.data.timezone)?.format('LLL')} ${cellProps.data.timezoneLabel || DEFAULT_TIME_ZONE_LABEL}`;
        }
      }
    },
    {
      name: 'eventCoordinatorEmail',
      header: 'Coordinator',
      type: 'string',
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: coordinators?.map((coordinator) => {
          return { id: coordinator.email, label: coordinator.name };
        })
      },
      width: 200
    },
    {
      name: 'bookingStage',
      header: 'Stage ',
      type: 'string',
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: ['quote', 'requested', 'rejected', 'accepted', 'deposit', 'paid', 'closed'].map((c) => {
          return { id: c, label: c };
        })
      },
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

    {
      name: 'customerName',
      header: 'Customer ',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      render: ({ data }) => {
        if (isNotEmptyArray(data.bookingTags) && data.bookingTags.includes('repeat')) {
          return (
            <div>
              {data.customerName} <span className="card-tags text-warning">{'Repeat'}</span>
            </div>
          );
        }
        return data.customerName;
      }
    },
    { name: 'customerEmail', header: 'Email ', type: 'string', filterEditor: StringFilter, filterDelay: 1500 },
    { name: 'customerPhone', header: 'Phone ', type: 'number', defaultVisible: false, filterEditor: StringFilter, filterDelay: 1500 },
    { name: 'customerCompany', header: 'Company ', type: 'string', filterEditor: StringFilter, filterDelay: 1500 },
    {
      name: 'className',
      header: 'Class ',
      type: 'string',
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: classes?.map((teamClass) => {
          return { id: teamClass.title, label: teamClass.title };
        })
      },
      width: 300
    },
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
      name: 'registeredAttendees',
      header: 'Registered Attendees ',
      type: 'number',
      filterEditor: NumberFilter,
      filterDelay: 1500,
      defaultWidth: 112,
      render: ({ value }) => {
        if (value >= 0) {
          return <span className="float-right">{+value}</span>;
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
          return `${moment(value)?.format('LLL')}`;
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
        return <span className="float-right">{value.toFixed(2)}</span>;
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
        return <span className="float-right">{value.toFixed(2)}</span>;
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
        return <span className="float-right">{value.toFixed(2)}</span>;
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
        return <span className="float-right">{value.toFixed(2)}</span>;
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
        return <span className="float-right">{value.toFixed(2)}</span>;
      }
    },
    {
      name: 'depositPaidDate',
      header: 'Deposits date',
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
      name: 'finalPaid',
      header: 'Final paid',
      type: 'number',
      defaultWidth: 150,
      filterEditor: NumberFilter,
      render: ({ value, cellProps }) => {
        return <span className="float-right">{value.toFixed(2)}</span>;
      }
    },
    {
      name: 'finalPaymentPaidDate',
      header: 'Final payment date',
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
      name: 'balance',
      header: 'Balance',
      type: 'number',
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value, cellProps }) => {
        return <span className="float-right">{value.toFixed(2)}</span>;
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
      name: 'bookingTags',
      header: 'Bookings Tags',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value.join(', ')}</span>;
        }
      }
    },
    {
      name: 'customerTags',
      header: 'Customer Tags',
      type: 'string',
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: ['repeat'].map((tag) => {
          return { id: tag, label: tag };
        })
      },
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value, cellProps }) => {
        if (isNotEmptyArray(value)) {
          return <span className="float-left">{value.join(',')}</span>;
        }
      }
    },
    {
      name: 'gclid',
      header: 'Gclid',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: 'instantBooking',
      header: 'Instant Booking',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value ? 'Yes' : 'No'}</span>;
        }
      }
    },
    {
      name: 'utm_campaign',
      header: 'Utm Compaign',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: 'utm_source',
      header: 'Utm Source',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: 'utm_medium',
      header: 'Utm Medium',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: 'utm_content',
      header: 'Utm Content',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: 'utm_term',
      header: 'Utm Term',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: 'preEventSurvey.submittedAt',
      header: 'Pre-event submitted',
      type: 'date',
      width: 250,
      filterEditor: DateFilter,
      render: ({ cellProps }) => {
        if (cellProps?.data?.preEventSurvey?.submittedAt) {
          return `${moment(cellProps.data.preEventSurvey.submittedAt)?.format('LLL')}`;
        }
      }
    },
    {
      name: 'preEventSurvey.source',
      header: 'Pre-event source',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ cellProps }) => {
        return <span className="float-left">{cellProps?.data?.preEventSurvey?.source}</span>;
      }
    },
    {
      name: 'totalInstructorInvoice',
      header: 'Instructor invoice',
      type: 'number',
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value }) => {
        if (value) {
          return <span className="float-right">{value.toFixed(2)}</span>;
        }
      }
    },
    {
      name: 'instructorInvoiceStatus',
      header: 'Instructor invoice status',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: 'totalDistributorInvoice',
      header: 'Distributor Invoice',
      type: 'number',
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value }) => {
        if (value) {
          return <span className="float-right">{value.toFixed(2)}</span>;
        }
      }
    },
    {
      name: 'distributorInvoiceStatus',
      header: 'Distributor Invoice Status',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: 'totalMembershipDiscount',
      header: 'Total Membership Discount',
      type: 'number',
      filterEditor: NumberFilter,
      filterDelay: 1500,
      defaultWidth: 150,
      render: ({ value }) => {
        if (value) {
          return <span className="float-right">{value.toFixed(2)}</span>;
        }
      }
    },
    {
      name: 'firstTouchChannel',
      header: 'First Touch Channel',
      type: 'string',
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    }
  ];

  const { ...allClasses } = useQuery(queryAllClasses, {
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: { isActive: true }
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
      filter: {}
    },
    onCompleted: (data) => {
      if (data) setCustomers(data.customers);
    },
    pollInterval: 200000
  });

  useQuery(queryAllInstructors, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data) setInstructors(data.instructors);
    },
    pollInterval: 200000
  });

  const gridStyle = { minHeight: 600, marginTop: 10 };

  const applyFilters = () => {
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
        { name: 'bookingStage', type: 'select', operator: 'inlist', value: undefined },
        { name: 'closedReason', type: 'string', operator: 'contains', value: '' },
        { name: 'gclid', type: 'string', operator: 'contains', value: '' },
        { name: 'customerEmail', type: 'string', operator: 'contains', value: '' },
        { name: 'customerPhone', type: 'string', operator: 'contains', value: '' },
        { name: 'customerCompany', type: 'string', operator: 'contains', value: '' },
        { name: 'eventCoordinatorEmail', type: 'select', operator: 'inlist', value: coordinatorFilterValue ? [coordinatorFilterValue] : undefined },
        { name: 'className', type: 'select', operator: 'inlist', value: undefined },
        { name: 'attendees', type: 'number', operator: 'gte', value: undefined },
        { name: 'registeredAttendees', type: 'number', operator: 'gte', value: undefined },
        { name: 'taxAmount', type: 'number', operator: 'gte', value: undefined },
        { name: 'serviceFeeAmount', type: 'number', operator: 'gte', value: undefined },
        { name: 'cardFeeAmount', type: 'number', operator: 'gte', value: undefined },
        { name: 'totalInvoice', type: 'number', operator: 'gte', value: undefined },
        { name: 'depositsPaid', type: 'number', operator: 'gte', value: undefined },
        { name: 'finalPaid', type: 'number', operator: 'gte', value: undefined },
        { name: 'depositPaidDate', type: 'date', operator: 'inrange', value: undefined },
        { name: 'finalPaymentPaidDate', type: 'date', operator: 'inrange', value: undefined },
        { name: 'balance', type: 'number', operator: 'gte', value: undefined },
        { name: 'eventDateTime', type: 'date', operator: 'inrange', value: undefined },
        { name: 'signUpDeadline', type: 'date', operator: 'inrange', value: undefined },
        { name: 'customerTags', type: 'select', operator: 'inlist', value: undefined },
        { name: 'utm_campaign', type: 'string', operator: 'contains', value: '' },
        { name: 'utm_source', type: 'string', operator: 'contains', value: '' },
        { name: 'utm_medium', type: 'string', operator: 'contains', value: '' },
        { name: 'utm_content', type: 'string', operator: 'contains', value: '' },
        { name: 'utm_term', type: 'string', operator: 'contains', value: '' },
        { name: 'bookingTags', type: 'string', operator: 'contains', value: '' },
        { name: 'totalInstructorInvoice', type: 'number', operator: 'contains', value: '' },
        { name: 'instructorInvoiceStatus', type: 'string', operator: 'contains', value: '' },
        { name: 'totalDistributorInvoice', type: 'number', operator: 'contains', value: '' },
        { name: 'distributorInvoiceStatus', type: 'string', operator: 'contains', value: '' },
        { name: 'preEventSurvey.submittedAt', type: 'date', operator: 'inrange', value: undefined },
        { name: 'preEventSurvey.source', type: 'string', operator: 'contains', value: '' },
        { name: 'totalMembershipDiscount', type: 'number', operator: 'contains', value: '' },
        { name: 'firstTouchChannel', type: 'string', operator: 'contains', value: '' }
      ];
    }

    setFilterValue(currentFilters);
    setOrFilters([]);
  };
  useEffect(() => {
    applyFilters();
  }, []);

  const onEditCompleted = (bookingId) => {
    const sortEditedData = { dir: -1, id: 'updatedAt', name: 'updatedAt', type: 'date' };
    const currentFilters = [...orFilters];
    currentFilters.push({ name: '_id', type: 'string', operator: 'eq', value: bookingId });
    currentFilters.push({ name: '_id', type: 'string', operator: 'neq', value: bookingId });
    setOrFilters(currentFilters);
    setSortInfo(sortEditedData);
  };

  const onAddCompleted = (bookingId) => {
    const currentFilters = [...filterValue.filter((element) => element.name !== '_id')];
    const idFilter = { name: '_id', type: 'string', operator: 'contains', value: bookingId };
    currentFilters.push(idFilter);
    setFilterValue(currentFilters);
  };

  const getDataToExport = async () => {
    const filters = getQueryFiltersFromFilterArray(filterValue);
    return await getAllDataToExport(filters, orFilters, sortInfo);
  };

  const loadData = async ({ skip, limit, sortInfo, filterValue }) => {
    const filters = getQueryFiltersFromFilterArray(filterValue);
    const response = await apolloClient.query({
      query: queryGetBookingsWithCriteria,
      fetchPolicy: 'network-only',
      variables: {
        limit,
        offset: skip,
        sortBy: sortInfo,
        filterBy: filters,
        filterByOr: orFilters
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

  const renderRowContextMenu = (menuProps) => {
    menuProps.autoDismiss = true;
    menuProps.items = [
      {
        label: 'Close with reason:',
        disabled: true
      },
      {
        label: 'Won',
        onClick: () => {
          setClosedReason('Won');
          toggle();
        }
      },
      {
        label: 'Lost',
        onClick: () => {
          setClosedReason('Lost');
          toggle();
        }
      },
      {
        label: 'Mistake',
        onClick: () => {
          setClosedReason('Mistake');
          toggle();
        }
      },
      {
        label: 'Duplicated',
        onClick: () => {
          setClosedReason('Duplicated');
          toggle();
        }
      },
      {
        label: 'Test',
        onClick: () => {
          setClosedReason('Test');
          toggle();
        }
      }
    ];
  };

  const onSelectionChange = useCallback(({ selected, data }) => {
    if (selected === true) {
      data.forEach((booking) => setSelected((prev) => ({ ...prev, [booking._id]: booking })));
    } else {
      setSelected(selected);
    }
  }, []);

  const toArray = (selected) => Object.keys(selected);

  const selectedBookingsIds = toArray(selected);

  return (
    <div>
      <TasksBar
        setElementToAdd={setElementToAdd}
        titleView={'ALL Time Bookings (Beta)'}
        titleBadge={` ${totalRows} records found`}
        showAddModal={() => handleModal()}
        getDataToExport={getDataToExport}
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
        selected={selected}
        checkboxColumn
        enableSelection={true}
        onSelectionChange={onSelectionChange}
        renderRowContextMenu={selectedBookingsIds.length > 0 ? renderRowContextMenu : null}
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
        allInstructors={instructors}
        allClasses={classes}
        handleClose={() => setCurrentElement({})}
        editMode={currentElement && currentElement.status !== 'closed' ? true : false}
        onEditCompleted={onEditCompleted}
      />
      <Modal isOpen={isOpenModal} centered>
        <ConfirmBookingsToClose
          toggle={toggle}
          closedReason={closedReason}
          selectedBookingsIds={selectedBookingsIds}
          onEditCompleted={onEditCompleted}
          setSelected={setSelected}
        />
      </Modal>
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

ReactDataGrid.defaultProps.filterTypes.select = {
  type: 'select',
  emptyValue: undefined,
  operators: [
    {
      name: 'inlist',
      fn: {}
    },
    {
      name: 'notinlist',
      fn: {}
    }
  ]
};
