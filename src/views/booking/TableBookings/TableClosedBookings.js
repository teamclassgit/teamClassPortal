// ** React Imports
import React, { Fragment, useState } from 'react'
// ** Third Party Components
import moment from 'moment'
import Avatar from '@components/avatar'
import DataTable from 'react-data-table-component'
import { Edit2, ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { Card } from 'reactstrap'
import { getCustomerEmail, getClassTitle, getFormattedEventDate, getCustomerPhone, getCustomerCompany, getCoordinatorName } from '../common'
import './TableBookings.scss'
import CardLink from 'reactstrap/lib/CardLink'

const DataTableClosedBookings = ({ filteredData, customers, classes, calendarEvents, coordinators, handleEditModal }) => {
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
                  currentNotes: row.notes
                })
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
      name: 'Reason',
      selector: 'closedReason',
      sortable: true,
      maxWidth: '105px',
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">{row.closedReason}</span>
          </div>
        </small>
      )
    },
    {
      name: 'Customer',
      selector: 'customerName',
      sortable: true,
      maxWidth: '100px',
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
      maxWidth: '260px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getCustomerEmail(row.customerId, customers)}</span>
        </small>
      )
    },
    {
      name: 'Coordinator',
      selector: 'coordinator.name',
      sortable: true,
      maxWidth: '80px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getCoordinatorName(row.eventCoordinatorId, coordinators)}</span>
        </small>
      )
    },
    {
      name: 'Class',
      selector: 'teamClassId',
      sortable: true,
      maxWidth: '320px',
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
      maxWidth: '120px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getFormattedEventDate(row._id, calendarEvents)}</span>
        </small>
      )
    },

    {
      name: 'Actions',
      allowOverflow: true,
      maxWidth: '50px',
      cell: (row) => {
        const calendarEvent = calendarEvents.find((element) => element.bookingId === row._id)

        return row.status === 'quote' ? (
          <small>
            <div className="d-flex">
              <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          </small>
        ) : row.status === 'date-requested' && calendarEvent && calendarEvent.status === 'reserved' ? (
          <small>
            <div className="d-flex">
              <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          </small>
        ) : row.status === 'date-requested' && calendarEvent && calendarEvent.status === 'confirmed' ? (
          <small>
            <div className="d-flex">
              <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          </small>
        ) : row.status === 'date-requested' && calendarEvent && calendarEvent.status === 'rejected' ? (
          <small>
            <div className="d-flex">
              <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          </small>
        ) : row.status === 'confirmed' ? (
          <small>
            <div className="d-flex">
              <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          </small>
        ) : row.status === 'paid' ? (
          <small>
            <div className="d-flex">
              <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          </small>
        ) : row.status !== 'canceled' ? (
          <small>
            <div className="d-flex">
              <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          </small>
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

export default DataTableClosedBookings
