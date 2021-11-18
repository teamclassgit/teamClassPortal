// @packages
import DataTable from 'react-data-table-component';
import Proptypes from 'prop-types';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import { Card } from 'reactstrap';
import { ChevronDown } from 'react-feather';

// @scripts
import '../booking/TableBookings/TableBookings.scss';
import { getCoordinatorName } from '../booking/common';

const TablePrivateRequests = ({ filteredData, coordinators }) => {
  const [currentPage, setCurrentPage] = useState(0);

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
      name: 'Coordinator',
      selector: 'coordinator.name',
      sortable: true,
      maxWidth: '120px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getCoordinatorName(row.eventCoordinatorId, coordinators)}</span>
        </small>
      )
    },
    {
      name: 'Attendees',
      selector: 'attendees',
      sortable: true,
      maxWidth: '100px',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{row.attendees}</span>
        </small>
      )
    },
    {
      name: 'Date option 1',
      selector: 'dateOption1',
      sortable: true,
      maxWidth: '170px',
      cell: (row) => (
        <small>
          {row.dateOption1 &&
            moment(row.dateOption1).calendar(null, {
              lastDay: '[Yesterday]',
              sameDay: 'LT',
              lastWeek: 'dddd',
              sameElse: 'MMMM Do, YYYY'
            })}
        </small>
      )
    },
    {
      name: 'Date option 2',
      selector: 'dateOption2',
      sortable: true,
      maxWidth: '170px',
      cell: (row) => (
        <small>
          {row.dateOption2 &&
            moment(row.dateOption2).calendar(null, {
              lastDay: '[Yesterday]',
              sameDay: 'LT',
              lastWeek: 'dddd',
              sameElse: 'MMMM Do, YYYY'
            })}
        </small>
      )
    }
  ];

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  // ** Custom Pagination
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
        className='react-dataTable'
        columns={columns}
        data={filteredData}
        defaultSortAsc={false}
        responsive
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

export default TablePrivateRequests;

TablePrivateRequests.propTypes = {
  coordinators: Proptypes.array.isRequired,
  filteredData: Proptypes.array.isRequired
};
