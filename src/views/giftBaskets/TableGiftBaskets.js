// @packages
import DataTable from 'react-data-table-component';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import { Card } from 'reactstrap';
import { ChevronDown } from 'react-feather';
import { getCustomerEmail } from '../../views/booking/common';
import ExpandableTable from './ExpandableTable';

const TableGiftBaskets = ({ giftBasketPurchases, giftBaskets, customers }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const columns = [
    {
      name: 'Date',
      selector: 'timePurchased',
      sortable: true,
      maxWidth: '12%',
      cell: (row) => (
        <>
          <small>
            {moment(row.timePurchased).calendar(null, {
              lastDay: '[Yesterday]',
              sameDay: 'LT',
              lastWeek: 'dddd',
              sameElse: 'MMMM Do, YYYY'
            })}
          </small>
        </>
      )
    },
    {
      name: 'Customer',
      selector: 'customerName',
      sortable: true,
      maxWidth: '12%',
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
      selector: 'customerEmail',
      sortable: true,
      maxWidth: '15%',
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{getCustomerEmail(row.customerId, customers)}</span>
        </small>
      )
    },

    {
      name: 'Gif tBasket',
      selector: 'basketName',
      sortable: true,
      maxWidth: '23%',
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">
              {row.basketsPurchased.map((item) => {
                const filterBasketGift = giftBaskets && giftBaskets.filter((element) => element._id === item.basketId);
                return (
                  <ul className="list-unstyled">
                    <li>{filterBasketGift && filterBasketGift.map((item2) => item2.title)}</li>
                  </ul>
                );
              })}
            </span>
          </div>
        </small>
      )
    },

    {
      name: 'Variant',
      selector: 'variantName',
      sortable: true,
      maxWidth: '30%',
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">
              {row.basketsPurchased.map((item) => {
                return (
                  <ul className="list-unstyled">
                    <li>
                      {item.variantName} ${item.priceBasket} x {item.quantity}
                    </li>
                  </ul>
                );
              })}
            </span>
          </div>
        </small>
      )
    },
    {
      name: 'Paid',
      selector: 'payments',
      sortable: true,
      maxWidth: '10%',
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">
              {row.payments.map((item) => {
                return (
                  <ul className="list-unstyled">
                    <li>${item.amount / 100}</li>
                  </ul>
                );
              })}
            </span>
          </div>
        </small>
      )
    }
  ];

  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=""
      nextLabel=""
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={giftBasketPurchases.length / 8 || 1}
      breakLabel="..."
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName={'active'}
      pageClassName={'page-item'}
      nextLinkClassName={'page-link'}
      nextClassName={'page-item next'}
      previousClassName={'page-item prev'}
      previousLinkClassName={'page-link'}
      pageLinkClassName={'page-link'}
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1'}
    />
  );

  return (
    <Card>
      <DataTable
        noHeader
        pagination
        data={giftBasketPurchases}
        expandableRows={true}
        columns={columns}
        expandOnRowClicked
        defaultSortField={'timePurchased'}
        defaultSortAsc={false}
        paginationPerPage={8}
        className="react-dataTable"
        sortIcon={<ChevronDown size={10} />}
        expandableRowsComponent={<ExpandableTable />}
        paginationDefaultPage={currentPage + 1}
        paginationComponent={CustomPagination}
      />
    </Card>
  );
};

export default TableGiftBaskets;
