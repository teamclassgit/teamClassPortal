// @packages
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import { Card } from 'reactstrap';
import { ChevronDown } from 'react-feather';

// @styles
import '../booking/TableBookings/TableBookings.scss';

const TableGeneralInquiries = ({ filteredData }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const columns = [
    {
      name: 'Created',
      selector: 'date',
      sortable: true,
      maxWidth: '8%',
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
      maxWidth: '10%',
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
      maxWidth: '16%',
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
      maxWidth: '9%',
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
      maxWidth: '55%',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{row.inquiry}</span>
        </small>
      )
    }
  ];

  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  const CustomPagination = () => (
    <ReactPaginate
      activeClassName="active"
      breakClassName="page-item"
      breakClassName="page-item"
      breakLabel="..."
      breakLinkClassName="page-link"
      breakLinkClassName="page-link"
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
      forcePage={currentPage}
      marginPagesDisplayed={2}
      nextClassName="page-item next"
      nextLabel=""
      nextLinkClassName="page-link"
      onPageChange={(page) => handlePagination(page)}
      pageClassName="page-item"
      pageCount={filteredData.length / 7 || 1}
      pageLinkClassName="page-link"
      pageRangeDisplayed={2}
      previousClassName="page-item prev"
      previousLabel=""
      previousLinkClassName="page-link"
    />
  );

  return (
    <Card>
      <DataTable
        className="react-dataTable"
        columns={columns}
        data={filteredData}
        defaultSortAsc={false}
        defaultSortField={'updatedAt'}
        noHeader
        pagination
        paginationComponent={CustomPagination}
        paginationDefaultPage={currentPage + 1}
        paginationPerPage={8}
        sortIcon={<ChevronDown size={10} />}
      />
    </Card>
  );
};

export default TableGeneralInquiries;

TableGeneralInquiries.propTypes = {
  filteredData: PropTypes.array.isRequired
};