// ** React Imports
import React, { Fragment, useState, useEffect, useContext } from 'react'
// ** Third Party Components
import moment from 'moment'
import Avatar from '@components/avatar'
import DataTable from 'react-data-table-component'
import { Edit2, ShoppingCart, ChevronDown, User, Users, DollarSign, Calendar, Check } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { Button, Card } from 'reactstrap'
import StatusSelector from './StatusSelector'
import { getCustomerEmail, getClassTitle, getBookingColor, getFormattedEventDate } from '../common'
import './TableBookings.scss'
import CardLink from 'reactstrap/lib/CardLink'

const DataTableBookings = ({ filteredData, customers, classes, calendarEvents }) => {
  const [currentPage, setCurrentPage] = useState(0)
  // ** Table Common Column
  const columns = [
    {
      name: 'Updated',
      selector: 'updatedAt',
      sortable: true,
      maxWidth: '120px',
      cell: (row) => (
        <small>
          {moment(row.createdAt).calendar(null, {
            lastDay: '[Yesterday]',
            sameDay: 'LT',
            lastWeek: 'dddd',
            sameElse: 'MMMM Do, YYYY'
          })}
        </small>
      )
    },
    {
      name: 'Customer',
      selector: 'customerName',
      sortable: true,
      maxWidth: '200px',
      cell: (row) => (
        <div className="d-flex align-items-center">
          <Avatar color={getBookingColor(row.status)} content={row.customerName} initials />
          <div className="user-info text-truncate ml-1">
            <span className="d-block font-weight-bold text-truncate">{row.customerName}</span>
          </div>
        </div>
      )
    },
    {
      name: 'Email',
      selector: 'customer.email',
      sortable: true,
      maxWidth: '280px',
      cell: (row) => (
        <div className="user-info text-truncate ml-1">
          <span className="d-block font-weight-bold text-truncate">{getCustomerEmail(row.customerId, customers)}</span>
        </div>
      )
    },
    {
      name: 'Class',
      selector: 'teamClassId',
      sortable: true,
      maxWidth: '250px',
      cell: (row) => (
        <div className="user-info text-truncate ml-1">
          <span className="d-block font-weight-bold text-truncate">{getClassTitle(row.teamClassId, classes)}</span>
        </div>
      )
    },
    {
      name: 'Attendees',
      selector: 'attendees',
      sortable: true,
      maxWidth: '20px'
    },
    {
      name: 'Event Date',
      selector: '_id',
      sortable: true,
      maxWidth: '150px',
      cell: (row) => (
        <div className="user-info text-truncate ml-1">
          <span className="d-block font-weight-bold text-truncate">{getFormattedEventDate(row._id, calendarEvents)}</span>
        </div>
      )
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      maxWidth: '100px',
      cell: (row) => <StatusSelector row={row} calendarEvent={calendarEvents.find((element) => element.bookingId === row._id)} />
    },
    {
      name: 'Actions',
      allowOverflow: true,
      maxWidth: '250px',
      cell: (row) => {
        const calendarEvent = calendarEvents.find((element) => element.bookingId === row._id)

        return row.status === 'quote' ? (
          <div className="d-flex">
            <CardLink href={`https://www.teamclass.com/booking/select-date-time/${row._id}`} target={'_blank'} title={'Select date and time link'}>
              <Avatar color="light-primary" size="sm" icon={<Calendar size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-black" size="sm" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : row.status === 'date-requested' && calendarEvent && calendarEvent.status === 'reserved' ? (
          <div className="d-flex">
            <CardLink href={`https://www.teamclass.com/booking/date-time-confirmation/${row._id}`} target={'_blank'} title={'Approve/Reject link'}>
              <Avatar color="light-primary" size="sm" icon={<Check size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/event/${row._id}`} target={'_blank'} title={'Sign-up link'}>
              <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/signUpStatus/${row._id}`} target={'_blank'} title={'Sign-up status'}>
              <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${row._id}`} target={'_blank'} title={'Deposit link'}>
              <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-black" size="sm" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : row.status === 'date-requested' && calendarEvent && calendarEvent.status === 'confirmed' ? (
          <div className="d-flex">
            <CardLink href={`https://www.teamclass.com/booking/date-time-confirmation/${row._id}`} target={'_blank'} title={'Approve/Reject link'}>
              <Avatar color="light-primary" size="sm" icon={<Check size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/event/${row._id}`} target={'_blank'} title={'Sign-up link'}>
              <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/signUpStatus/${row._id}`} target={'_blank'} title={'Sign-up status'}>
              <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${row._id}`} target={'_blank'} title={'Deposit link'}>
              <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-black" size="sm" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : row.status === 'date-requested' && calendarEvent && calendarEvent.status === 'rejected' ? (
          <div className="d-flex">
            <CardLink href={`https://www.teamclass.com/booking/date-time-confirmation/${row._id}`} target={'_blank'} title={'Approve/Reject link'}>
              <Avatar color="light-primary" size="sm" icon={<Check size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/event/${row._id}`} target={'_blank'} title={'Sign-up link'}>
              <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/signUpStatus/${row._id}`} target={'_blank'} title={'Sign-up status'}>
              <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${row._id}`} target={'_blank'} title={'Deposit link'}>
              <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-black" size="sm" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : row.status === 'confirmed' ? (
          <div className="d-flex">
            <CardLink href={`https://www.teamclass.com/event/${row._id}`} target={'_blank'} title={'Sign-up link'}>
              <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/signUpStatus/${row._id}`} target={'_blank'} title={'Sign-up status'}>
              <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${row._id}`} target={'_blank'} title={'Deposit link'}>
              <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/payment/${row._id}`} target={'_blank'} title={'Final payment link'}>
              <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-black" size="sm" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : row.status === 'paid' ? (
          <div className="d-flex">
            <CardLink href={`https://www.teamclass.com/event/${row._id}`} target={'_blank'} title={'Sign-up link'}>
              <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/signUpStatus/${row._id}`} target={'_blank'} title={'Sign-up status'}>
              <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${row._id}`} target={'_blank'} title={'Deposit link'}>
              <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/payment/${row._id}`} target={'_blank'} title={'Final payment link'}>
              <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-black" size="sm" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : row.status !== 'canceled' ? (
          <div className="d-flex">
            <CardLink href={`https://www.teamclass.com/event/${row._id}`} target={'_blank'} title={'Sign-up link'}>
              <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/signUpStatus/${row._id}`} target={'_blank'} title={'Sign-up status'}>
              <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${row._id}`} target={'_blank'} title={'Deposit link'}>
              <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/payment/${row._id}`} target={'_blank'} title={'Final payment link'}>
              <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-black" size="sm" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : (
          <></>
        )
      }
    }
  ]

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected)
  }

  // ** Custom Pagination
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
  )

  return (
    <Fragment>
      <Card>
        <DataTable
          noHeader
          pagination
          columns={columns}
          defaultSortField={'updatedAt'}
          defaultSortAsc={false}
          paginationPerPage={8}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          paginationComponent={CustomPagination}
          data={filteredData}
        />
      </Card>
    </Fragment>
  )
}

export default DataTableBookings
