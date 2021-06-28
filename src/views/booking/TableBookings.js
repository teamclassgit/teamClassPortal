// ** React Imports
import React, { Fragment, useState, useEffect, useContext } from 'react'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import Avatar from '@components/avatar'
import moment from 'moment'
import { toAmPm } from '../../utility/Utils'
import AddNewBooking from './AddNewBooking'
import { ChevronDown } from 'react-feather'
import { FiltersContext } from '../../context/FiltersContext/FiltersContext'
import { Badge, Card } from 'reactstrap'

const DataTableBookings = ({ bookings, customers, setCustomers, classes, calendarEvents, changeView }) => {
  const { classFilterContext } = useContext(FiltersContext)
  const [data, setData] = useState(bookings)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentElement, setCurrentElement] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [modal, setModal] = useState(false)

  const handleFilterByClass = (classId) => {
    const newBookings = bookings.filter(({ teamClassId }) => teamClassId === classId)
    setFilteredData(newBookings)
    setSearchValue(classId)
  }

  const handleFilterType = ({ type, value }) => {
    switch (type) {
      case 'class':
        handleFilterByClass(value)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (classFilterContext) {
      handleFilterType(classFilterContext)
    } else {
      setFilteredData(data)
      setSearchValue('')
    }
  }, [classFilterContext])

  useEffect(() => {
    setData(bookings)
  }, [bookings])

  const status = {
    quote: { title: 'quote', color: 'light-danger' },
    'quote-a': { title: 'quote', color: 'light-danger' },
    'quote-b': { title: 'quote', color: 'light-danger' },
    scheduled: { title: 'scheduled', color: 'light-warning' },
    confirmed: { title: 'confirmed', color: 'light-success' },
    draft: { title: 'quote', color: 'light-danger' },
    canceled: { title: 'canceled', color: 'light-danger' }
  }

  const getCustomerEmail = (customerId) => {
    const result = customers.filter((element) => element.id === customerId)
    return result && result.length > 0 ? result[0].email : ''
  }

  const getClassTitle = (teamClassId) => {
    const result = classes.filter((element) => element.id === teamClassId)
    return result && result.length > 0 ? result[0].title : ''
  }

  const getFormattedEventDate = (bookingId) => {
    const result = calendarEvents.filter((element) => element.bookingId === bookingId)

    if (result && result.length > 0) {
      const calendarEvent = result[0]
      const date = new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day)
      const time = toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, '')
      return `${moment(date).format('LL')} ${time}`
    }

    return ''
  }

  // ** Table Common Column
  const columns = [
    {
      name: 'Created',
      selector: 'createdAt',
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
      maxWidth: '180px',
      cell: (row) => (
        <div className="d-flex align-items-center">
          <Avatar color={`${status[row.status].color}`} content={row.customerName} initials />
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
          <span className="d-block font-weight-bold text-truncate">{getCustomerEmail(row.customerId)}</span>
        </div>
      )
    },
    {
      name: 'Class',
      selector: 'teamClassId',
      sortable: true,
      maxWidth: '170px',
      cell: (row) => (
        <div className="user-info text-truncate ml-1">
          <span className="d-block font-weight-bold text-truncate">{getClassTitle(row.teamClassId)}</span>
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
      selector: 'id',
      sortable: true,
      maxWidth: '150px',
      cell: (row) => (
        <div className="user-info text-truncate ml-1">
          <span className="d-block font-weight-bold text-truncate">{getFormattedEventDate(row.id)}</span>
        </div>
      )
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      maxWidth: '40px',
      cell: (row) => {
        return (
          <Badge color={status[row.status] && status[row.status].color} pill>
            {status[row.status] ? status[row.status].title : row.status}
          </Badge>
        )
      }
    },
    {
      name: 'Actions',
      allowOverflow: true,
      maxWidth: '20px',
      cell: (row) => {
        return (
          <div className="d-flex">
            <a href={`/booking/${row.id}`} target={'blank'}>
              Checkout
            </a>
          </div>
        )
      }
    }
  ]

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

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
      pageCount={searchValue.length ? filteredData.length / 7 : data.length / 7 || 1}
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
          defaultSortField={'createdAt'}
          defaultSortAsc={false}
          paginationPerPage={7}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          paginationComponent={CustomPagination}
          data={searchValue.length ? filteredData : data}
        />
      </Card>

      <AddNewBooking
        open={modal}
        handleModal={handleModal}
        data={data}
        setData={setData}
        classes={classes}
        setCustomers={setCustomers}
        customers={customers}
        currentElement={currentElement}
      />
    </Fragment>
  )
}

export default DataTableBookings
