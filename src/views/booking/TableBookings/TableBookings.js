// ** React Imports
import React, { Fragment, useState, useEffect, useContext } from 'react'
// ** Third Party Components
import moment from 'moment'
import Avatar from '@components/avatar'
import DataTable from 'react-data-table-component'
import { Edit2, ShoppingCart, ChevronDown, User, Users, DollarSign, Calendar } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { FiltersContext } from '../../../context/FiltersContext/FiltersContext'
import { Button, Card } from 'reactstrap'
import StatusSelector from './StatusSelector'
import {
  getCustomerEmail,
  getClassTitle,
  getBookingValue,
  getCustomerPhone,
  getCustomerCompany,
  getBookingColor,
  getFormattedEventDate
} from '../common'
import './TableBookings.scss'
import CardLink from 'reactstrap/lib/CardLink'

const DataTableBookings = ({ bookings, customers, setBookings, setCurrentElement, classes, calendarEvents, changeView }) => {
  const { classFilterContext } = useContext(FiltersContext)
  const [data, setData] = useState(bookings)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const handleFilterByClass = (classId) => {
    const newBookings = bookings.filter(({ teamClassId }) => teamClassId === classId)
    setFilteredData(newBookings)
    setSearchValue(classId)
  }

  const handleSearch = (value) => {
    let updatedData = []
    if (value.length) {
      updatedData = bookings.filter((item) => {
        const startsWith =
          (item.customerName && item.customerName.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.customerId && getCustomerEmail(item.customerId, customers).toLowerCase().startsWith(value.toLowerCase())) ||
          (item.teamClassId && getClassTitle(item.teamClassId, classes).toLowerCase().startsWith(value.toLowerCase()))

        const includes =
          (item.customerName && item.customerName.toLowerCase().includes(value.toLowerCase())) ||
          (item.customerId && getCustomerEmail(item.customerId, customers).toLowerCase().includes(value.toLowerCase())) ||
          (item.teamClassId && getClassTitle(item.teamClassIdm, classes).toLowerCase().includes(value.toLowerCase()))

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    } else {
      setFilteredData(bookings)
    }
  }

  const handleFilterType = ({ type, value }) => {
    switch (type) {
      case 'class':
        handleFilterByClass(value)
        break
      case 'text':
        handleSearch(value)
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
      maxWidth: '250px',
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
      maxWidth: '300px',
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
      maxWidth: '200px',
      cell: (row) => <StatusSelector row={row} calendarEvent={calendarEvents.find((element) => element.bookingId === row._id)} />
    },
    {
      name: 'Actions',
      allowOverflow: true,
      maxWidth: '20px',
      cell: (row) => {
        return row.status === 'quote' ? (
          <div className="d-flex">
            <CardLink href={`https://www.teamclass.com/booking/select-date-time/${row._id}`} target={'_blank'} title={'Select date and time Page'}>
              <Avatar color="light-primary" icon={<Calendar size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" icon={<Edit2 size={18} />} />
            </CardLink>
          </div>
        ) : row.status !== 'canceled' ? (
          <div className="d-flex">
            <CardLink href={`https://www.teamclass.com/event/${row._id}`} target={'_blank'} title={'Sign-up page'}>
              <Avatar color="light-primary" icon={<User size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/signUpStatus/${row._id}`} target={'_blank'} title={'Sign-up status'}>
              <Avatar color="light-primary" icon={<Users size={18} />} />
            </CardLink>
            <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${row._id}`} target={'_blank'} title={'Checkout status'}>
              <Avatar color="light-primary" icon={<DollarSign size={18} />} />
            </CardLink>
            <CardLink href={`/booking/${row._id}`} target={'_blank'} title={'Edit booking'}>
              <Avatar color="light-secondary" icon={<Edit2 size={18} />} />
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
          defaultSortField={'updatedAt'}
          defaultSortAsc={false}
          paginationPerPage={8}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          paginationComponent={CustomPagination}
          data={searchValue.length ? filteredData : data}
        />
      </Card>
    </Fragment>
  )
}

export default DataTableBookings
