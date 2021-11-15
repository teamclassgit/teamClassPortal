import React, { Fragment, useState } from 'react'

import moment from 'moment'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { Card } from 'reactstrap'

const TableGeneralInquiries = ({ filteredData }) => {
  const [currentPage, setCurrentPage] = useState(0)

  // ** Table Common Column
  const columns = [
    {
      name: 'Created',
      selector: 'date',
      sortable: true,
      maxWidth: '150px',
      cell: (row) => (
        <small>
          {moment(row.date).calendar(null, {
            lastDay: '[Yesterday]',
            sameDay: 'LT',
            lastWeek: 'dddd',
            sameElse: 'MMMM Do, YYYY'
          })}
        </small>
      )
    },

    {
      name: 'Name',
      selector: 'name',
      sortable: true,
      maxWidth: '170px',
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">{row.name}</span>
          </div>
        </small>
      )
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
      maxWidth: '200px',
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">{row.email}</span>
          </div>
        </small>
      )
    },
    {
      name: 'Phone',
      selector: 'phone',
      sortable: true,
      maxWidth: '120px',
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">{row.phone}</span>
          </div>
        </small>
      )
    },
    {
      name: 'Inquiry',
      selector: 'inquiry',
      sortable: true,
      maxWidth: '600px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold text-justify">{row.inquiry}</span>
        </small>
      )
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

export default TableGeneralInquiries
