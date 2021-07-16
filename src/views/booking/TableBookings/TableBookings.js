// ** React Imports
import React, { Fragment, useState, useEffect, useContext } from 'react'
// ** Third Party Components
import moment from 'moment'
import Avatar from '@components/avatar'
import DataTable from 'react-data-table-component'
import { Edit2, ShoppingCart, ChevronDown } from 'react-feather'
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
      maxWidth: '180px',
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
      maxWidth: '170px',
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
      maxWidth: '200px',
      cell: (row) => <StatusSelector value={getBookingValue(row.status)} row={row} bookings={bookings} setBookings={setBookings} />
    },
    {
      name: 'Actions',
      allowOverflow: true,
      maxWidth: '20px',
      cell: (row) => {
        return (
          <div className="d-flex">
            <Button
              color="link"
              className="m-0 p-0"
              onClick={() => {
                const { customerId, customerName, teamClassId, attendees, _id } = row
                const newElement = {
                  _id,
                  customerId,
                  name: customerName,
                  email: getCustomerEmail(customerId, customers),
                  phone: getCustomerPhone(customerId, customers),
                  company: getCustomerCompany(customerId, customers),
                  class: teamClassId,
                  attendees,
                  editMode: true
                }
                setCurrentElement(newElement)
              }}
            >
              <Avatar color="light-primary" className="rounded mr-1" icon={<Edit2 size={18} />} />
            </Button>
            <a href={`/booking/${row._id}`} target={'_blank'}>
              <Avatar color="light-secondary" className="rounded mr-1" icon={<ShoppingCart size={18} />} />
            </a>
          </div>
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
          defaultSortField={'createdAt'}
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
