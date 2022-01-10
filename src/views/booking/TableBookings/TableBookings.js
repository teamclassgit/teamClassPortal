// @packages
import Avatar from '@components/avatar';
import CardLink from 'reactstrap/lib/CardLink';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Edit2, ChevronDown, User, Users, DollarSign, Calendar, Check } from 'react-feather';
import { useHistory } from 'react-router';

// @scripts
import StatusSelector from './StatusSelector';
import moment from 'moment';
import { Card } from 'reactstrap';
import {
  getCustomerEmail,
  getClassTitle,
  getFormattedEventDate,
  getCustomerPhone,
  getCustomerCompany,
  getCoordinatorName,
  getDepositPaid,
  getFinalPaymentPaid,
  getLastPaymentDate
} from '../common';
import './TableBookings.scss';

const DataTableBookings = ({ calendarEvents, classes, coordinators, customers, filteredData, handleEditModal }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const history = useHistory();

  const columns = [
    {
      name: 'Updated',
      selector: 'updatedAt',
      sortable: true,
      maxWidth: '120px',
      cell: (row) => (
        <small>
          {moment(row.updatedAt).calendar(null, {
            lastDay: '[Yesterday]',
            sameDay: 'LT',
            lastWeek: 'dddd',
            sameElse: 'MMMM Do, YYYY'
          })}
        </small>
      )
    },
    {
      name: 'Id',
      selector: '_id',
      sortable: false,
      maxWidth: '200px',
      cell: (row) => (
        <>
          <small>
            <a
              href="#"
              onClick={() => {
                handleEditModal({
                  bookingId: row._id,
                  currentCustomerId: row.customerId,
                  currentName: row.customerName,
                  currentEmail: getCustomerEmail(row.customerId, customers),
                  currentPhone: getCustomerPhone(row.customerId, customers),
                  currentCompany: getCustomerCompany(row.customerId, customers),
                  currentCoordinatorId: row.eventCoordinatorId,
                  currentCoordinatorName: getCoordinatorName(row.eventCoordinatorId, coordinators),
                  currentTeamclassId: row.teamClassId,
                  currentTeamclassName: getClassTitle(row.teamClassId, classes),
                  currentGroupSize: row.attendees,
                  currentSignUpDeadline: row.signUpDeadline,
                  currentClassVariant: row.classVariant,
                  currentServiceFee: row.serviceFee,
                  currentSalesTax: row.salesTax,
                  createdAt: row.createdAt,
                  updatedAt: row.updatedAt,
                  currentStatus: row.status,
                  currentEventDurationHours: row.eventDurationHours,
                  currentClosedReason: row.closedReason,
                  currentNotes: row.notes,
                  currentPayments: row.payments,
                  currentCapRegistration: row.capRegistration
                });
              }}
              title={`Edit booking info ${row._id}`}
            >
              {row._id}
            </a>
          </small>
        </>
      )
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      maxWidth: '100px',
      cell: (row) => (
        <small>
          <StatusSelector row={row} calendarEvent={calendarEvents.find((element) => element.bookingId === row._id)} />
        </small>
      )
    },
    {
      name: 'Customer',
      selector: 'customerName',
      sortable: true,
      maxWidth: '200px',
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">{row.customerName}</span>
          </div>
        </small>
      )
    },
    {
      name: 'Email',
      selector: 'customer.email',
      sortable: true,
      maxWidth: '320px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getCustomerEmail(row.customerId, customers)}</span>
        </small>
      )
    },
    {
      name: 'Company',
      selector: 'customer.company',
      sortable: true,
      maxWidth: '200px',
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">{getCustomerCompany(row.customerId, customers)}</span>
          </div>
        </small>
      )
    },
    {
      name: 'Class',
      selector: 'teamClassId',
      sortable: true,
      maxWidth: '250px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getClassTitle(row.teamClassId, classes)}</span>
        </small>
      )
    },
    {
      name: '#',
      selector: 'attendees',
      sortable: true,
      maxWidth: '5px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{row.attendees}</span>
        </small>
      )
    },
    {
      name: 'Event Date',
      selector: '_id',
      sortable: true,
      maxWidth: '140px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getFormattedEventDate(row._id, calendarEvents)}</span>
        </small>
      )
    },
    {
      name: 'Deposit paid',
      selector: 'payments',
      sortable: false,
      maxWidth: '140px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getDepositPaid(row)}</span>
        </small>
      )
    },
    {
      name: 'Final payment paid',
      selector: 'payments',
      sortable: false,
      maxWidth: '140px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getFinalPaymentPaid(row)}</span>
        </small>
      )
    },
    {
      name: 'Last payment date',
      selector: 'payments',
      sortable: false,
      maxWidth: '140px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getLastPaymentDate(row)}</span>
        </small>
      )
    },
    {
      name: 'Actions',
      allowOverflow: true,
      maxWidth: '400px',
      cell: (row) => {
        const calendarEvent = calendarEvents.find((element) => element.bookingId === row._id);

        return row.status === 'quote' ? (
          <small>
            <div className="d-flex">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${row._id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(row._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
              </a>
            </div>
          </small>
        ) : row.status === 'date-requested' && calendarEvent && calendarEvent.status === 'reserved' ? (
          <small>
            <div className="d-flex">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${row._id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar />} />
              </a>
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/date-time-confirmation/${row._id}`}
                target={'_blank'}
                title={'Approve/Reject link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Check />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(row._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
              </a>
            </div>
          </small>
        ) : row.status === 'date-requested' && calendarEvent && calendarEvent.status === 'confirmed' ? (
          <small>
            <div className="d-flex">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${row._id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/booking/event-confirmation/${row._id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(row._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
              </a>
            </div>
          </small>
        ) : row.status === 'date-requested' && calendarEvent && calendarEvent.status === 'rejected' ? (
          <small>
            <div className="d-flex">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${row._id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(row._id)} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
              </a>
            </div>
          </small>
        ) : row.status === 'confirmed' ? (
          <small>
            <div className="d-flex">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${row._id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/event/${row._id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/signUpStatus/${row._id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/booking/payment/${row._id}`} target={'_blank'} title={'Final payment link'}>
                <Avatar color="secondary" size="sm" icon={<DollarSign />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(row._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
              </a>
            </div>
          </small>
        ) : (
          row.status === 'paid' && (
            <small>
              <div className="d-flex">
                <a
                  className="mr-1"
                  href={`https://www.teamclass.com/booking/select-date-time/${row._id}`}
                  target={'_blank'}
                  title={'Select date and time link'}
                >
                  <Avatar color="light-primary" size="sm" icon={<Calendar />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/event/${row._id}`} target={'_blank'} title={'Sign-up link'}>
                  <Avatar color="light-primary" size="sm" icon={<User />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/signUpStatus/${row._id}`} target={'_blank'} title={'Sign-up status'}>
                  <Avatar color="light-primary" size="sm" icon={<Users />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/booking/payment/${row._id}`} target={'_blank'} title={'Final payment link'}>
                  <Avatar color="secondary" size="sm" icon={<DollarSign />} />
                </a>
                <a className="mr-1" onClick={() => handleEdit(row._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                  <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
                </a>
              </div>
            </small>
          )
        );
      }
    }
  ];

  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  const handleEdit = (rowId) => {
    history.push(`/booking/${rowId}`);
  };

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=""
      nextLabel=""
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={filteredData.length / 7 || 1}
      breakLabel="..."
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      nextLinkClassName="page-link"
      nextClassName="page-item next"
      previousClassName="page-item prev"
      previousLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
    />
  );

  return (
    <Card>
      <DataTable
        noHeader
        pagination
        columns={columns}
        defaultSortField={'updatedAt'}
        defaultSortAsc={false}
        paginationPerPage={15}
        className="react-dataTable"
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage + 1}
        paginationComponent={CustomPagination}
        data={filteredData}
      />
    </Card>
  );
};

export default DataTableBookings;

DataTableBookings.propTypes = {
  calendarEvents: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  coordinators: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired,
  filteredData: PropTypes.array.isRequired,
  handleEditModal: PropTypes.func.isRequired
};
