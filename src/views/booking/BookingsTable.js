import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { apolloClient } from '../../utility/RealmApolloClient';

import queryGetBookingsWithCriteria from '../../graphql/QueryGetBookingsWithCriteria';
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
} from './common';
import { capitalizeString, getBookingTotals, getEventFullDate, getSignUpDeadlineFromEventDate, toAmPm } from '../../utility/Utils';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
// import Button from '@inovua/reactdatagrid-community/packages/Button';
import '@inovua/reactdatagrid-enterprise/index.css';
import '@inovua/reactdatagrid-enterprise/theme/default-light.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-dark.css';
import './BookingsTable.scss';

import Avatar from '@components/avatar';
import moment from 'moment';
import { Briefcase, Calendar, DollarSign, Mail, Phone, TrendingUp } from 'react-feather';
import { Badge, Button, Card, CardBody, CardTitle, CardText, CardFooter, Col, Media, Row } from 'reactstrap';

const renderRowDetails = ({ data, toggleRowExpand, rowSelected, rowActive, dataSource, rowId }) => {
  console.log('data', data);
  console.log('rowSelected', rowSelected);
  console.log('rowActive', rowActive);
  console.log('rowId', rowId);
  console.log('dataSource', dataSource);
  return (
    <div style={{ padding: 20 }}>
      <h4 className="mb-1">{capitalizeString(data.customerName)}</h4>
      <table>
        <tbody>
          <tr>
            <td>
              <Phone size={18} />
            </td>
            <td>{data.customerPhone}</td>
          </tr>
          <tr>
            <td>
              <Mail size={18} />
            </td>
            <td>{data.customerEmail}</td>
          </tr>
          <tr>
            <td>
              <Briefcase size={18} />
            </td>
            <td>{data.customerCompany}</td>
          </tr>
          <tr>
            <td>
              <Calendar size={18} />
            </td>
            <td>{data.eventDateTime && moment(data.eventDateTime).format('LLL')}</td>
          </tr>
          <tr>
            <td>
              <strong>Booking ID:</strong>
            </td>
            <td>{data._id}</td>
          </tr>
          <tr>
            <td>Class:</td>
            <td>{data.className}</td>
          </tr>

          <tr>
            <td>Attendees:</td>
            <td>{data.attendees}</td>
          </tr>
          <tr>
            {data.classVariant && (
              <>
                <td>Option:</td>
                <td>
                  {data.classVariant.title} {`$${data.classVariant.pricePerson}`} {data.classVariant.groupEvent ? '/group' : '/person'}
                </td>
              </>
            )}
          </tr>
          <tr>
            <td>International attendees:</td>
            <td>{data.hasInternationalAttendees ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Created:</td>
            <td>{moment(data.createdAt).format('LL')}</td>
          </tr>
          <tr>
            <td>Updated:</td>
            <td>{moment(data.updatedAt).format('LL')}</td>
          </tr>

          <tr>
            <td>Actions:</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const columns = [
  {
    name: 'updatedAt',
    header: 'Updated',
    type: 'date',
    filterEditor: DateFilter,
    render: ({ value, cellProps }) => {
      return moment(value).calendar(null, {
        lastDay: '[Yesterday]',
        sameDay: 'LT',
        lastWeek: 'dddd',
        sameElse: 'MMMM Do, YYYY'
      });
    }
  },
  { name: '_id', header: 'Id', type: 'string' },
  { name: 'status', header: 'Status', type: 'string' },
  { name: 'customerName', header: 'Customer ', type: 'string' },
  { name: 'customerPhone', header: 'Phone ', type: 'number' },
  { name: 'customerEmail', header: 'Email ', type: 'string' },
  { name: 'customerCompany', header: 'Company ', type: 'string' },
  { name: 'className', header: 'Class ', type: 'string' },
  { name: 'attendees', header: '# ', type: 'number', filterEditor: NumberFilter, defaultWidth: 112 },
  {
    name: 'eventDateTime',
    header: 'Event date',
    type: 'date',
    filterEditor: DateFilter,
    render: ({ value, cellProps }) => {
      if (value) {
        return moment(value).format('LLL');
      }
    }
  },
  {
    name: 'payments',
    id: 'depositPayments',
    header: 'Deposit paid',
    type: 'number',
    filterEditor: NumberFilter,
    render: ({ value, cellProps }) => {
      if (value) {
        const depositsPaid = value.filter((element) => element.paymentName === 'deposit' && element.status === 'succeeded');
        const initialDepositPaid =
          depositsPaid && depositsPaid.length > 0 ? depositsPaid.reduce((previous, current) => previous + current.amount, 0) / 100 : 0; //amount is in cents
        return `$ ${initialDepositPaid.toFixed(2)}`;
      }
    }
  },
  {
    name: 'payments',
    id: 'finalPayments',
    header: 'Final payment paid ',
    type: 'number',
    filterEditor: NumberFilter,
    render: ({ value, cellProps }) => {
      console.log('value', value);
      if (value) {
        const finalPaymentPaid = value.find((element) => element.paymentName === 'final' && element.status === 'succeeded');
        const paidAmount = finalPaymentPaid ? finalPaymentPaid.amount / 100 : 0;
        return `$ ${paidAmount.toFixed(2)}`;
      }
    }
  }
];

const DataGrid = () => {
  const skin = useSelector((state) => state.bookingsBackground);
  const [status, setStatus] = useState('Quote');

  const gridStyle = { minHeight: 600, marginTop: 10 };

  const defaultFilterValue = [
    { name: 'updatedAt', type: 'date', operator: 'before', value: undefined },
    { name: '_id', type: 'string', operator: 'contains', value: '' },
    { name: 'status', type: 'string', operator: 'contains', value: 'quote' },
    { name: 'customerName', type: 'string', operator: 'contains', value: '' },
    { name: 'customerEmail', type: 'string', operator: 'contains', value: '' },
    { name: 'customerCompany', type: 'string', operator: 'contains', value: '' },
    { name: 'customerPhone', type: 'string', operator: 'contains', value: '' },
    { name: 'className', type: 'string', operator: 'contains', value: '' },
    { name: 'attendees', type: 'number', operator: 'gte', value: 10 },
    { name: 'eventDateTime', type: 'date', operator: 'before', value: undefined },
    { name: 'depositPayments', id: 'depositPayments', type: 'number', operator: 'gte', value: undefined },
    { name: 'finalPayments', id: 'finalPayments', type: 'number', operator: 'gte', value: undefined }
  ];

  const loadData = ({ skip, limit, sortInfo, groupBy, filterValue }) => {
    console.log('limit', limit);
    console.log('sortInfo', sortInfo);
    console.log('filterValue', filterValue);

    const filters = filterValue
      .filter((item) => item.value !== null && item.value !== undefined && item.value !== '')
      .map(({ name, type, operator, value }) => {
        if (type === 'number' && (operator === 'inrange' || operator === 'notinrange')) return { name, type, operator, valueRangeNum: value };
        if (type === 'date' && (operator === 'inrange' || operator === 'notinrange')) return { name, type, operator, valueRange: value };
        if (type === 'number') return { name, type, operator, valueNum: value };
        return { name, type, operator, value };
      });

    console.log('filters', filters);
    return apolloClient
      .query({
        query: queryGetBookingsWithCriteria,
        variables: {
          limit,
          offset: skip,
          sortBy: sortInfo,
          filterBy: filters
        }
      })
      .then((response) => {
        console.log('entró', response);
        const totalCount = response.data.getBookingsWithCriteria.count;
        return { data: response.data.getBookingsWithCriteria.rows, count: totalCount };
      });
    // return { data: [], count: 0 };
  };

  const [filterValue, setFilterValue] = useState(defaultFilterValue);
  const [sortInfo, setSortInfo] = useState([]);
  const dataSource = useCallback(loadData, []);
  const [filteredRows, setFilteredRows] = useState(null);
  const [expandedRows, setExpandedRows] = useState({ 1: true, 2: true });
  const [collapsedRows, setCollapsedRows] = useState(null);
  const [cellSelection, setCellSelection] = useState({});

  console.log('filteredRows', filteredRows);
  const onExpandedRowsChange = useCallback(({ expandedRows, collapsedRows }) => {
    setExpandedRows(expandedRows);
    setCollapsedRows(collapsedRows);
  }, []);

  const onCopySelectedCellsChange = useCallback((cells) => {
    console.log(cells);
  }, []);

  const onPasteSelectedCellsChange = useCallback((cells) => {
    console.log(cells);
  }, []);

  // console.log('ReactDataGrid', ReactDataGrid.defaultProps.i18n);
  console.log('ReactDataGrid', ReactDataGrid.rowProps);

  return (
    <div>
      <Row className="d-flex justify-content-between mt-1">
        <Col md="6" xl="2">
          <Card className="">
            <CardBody className="pt-1 pb-1">
              <CardTitle className="text-center mb-0 ">
                <h6>Quote</h6>
              </CardTitle>
              <CardText>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                  <div>
                    <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>459</strong>
                    </div>
                    <div className="font-small-1">Events</div>
                  </div>
                </div>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                  <div>
                    <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>$153,596.36</strong>
                    </div>
                    <div className="font-small-1">Total</div>
                  </div>
                </div>
              </CardText>
            </CardBody>
            <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
              <Button
                color="primary"
                outline
                className="  btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setStatus('Quote');
                }}
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6" xl="2">
          <Card>
            <CardBody className="pt-1 pb-1">
              <CardTitle className="text-center mb-0">
                <h6>Requested </h6>
              </CardTitle>
              <CardText>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                  <div>
                    <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>459</strong>
                    </div>
                    <div className="font-small-1">Events</div>
                  </div>
                </div>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                  <div>
                    <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>$153,596.36</strong>
                    </div>
                    <div className="font-small-1">Total</div>
                  </div>
                </div>
              </CardText>
            </CardBody>
            <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
              <Button
                color="primary"
                outline
                className=" m-0 btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setStatus('Requested');
                }}
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6" xl="2">
          <Card>
            <CardBody className="pt-1 pb-1">
              <CardTitle className="text-center mb-0">
                <h6>Rejected</h6>
              </CardTitle>
              <CardText>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                  <div>
                    <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>459</strong>
                    </div>
                    <div className="font-small-1">Events</div>
                  </div>
                </div>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                  <div>
                    <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>$153,596.36</strong>
                    </div>
                    <div className="font-small-1">Total</div>
                  </div>
                </div>
              </CardText>
            </CardBody>
            <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
              <Button
                color="primary"
                outline
                className=" m-0 btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setStatus('Rejected');
                }}
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6" xl="2">
          <Card>
            <CardBody className="pt-1 pb-1">
              <CardTitle className="text-center mb-0">
                <h6>Accepted</h6>
              </CardTitle>
              <CardText>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                  <div>
                    <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>459</strong>
                    </div>
                    <div className="font-small-1">Events</div>
                  </div>
                </div>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                  <div>
                    <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>$153,596.36</strong>
                    </div>
                    <div className="font-small-1">Total</div>
                  </div>
                </div>
              </CardText>
            </CardBody>
            <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
              <Button
                color="primary"
                outline
                className=" m-0 btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setStatus('Accepted');
                }}
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6" xl="2">
          <Card>
            <CardBody className="pt-1 pb-1">
              <CardTitle className="text-center mb-0">
                <h6>Deposit paid</h6>
              </CardTitle>
              <CardText>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                  <div>
                    <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>459</strong>
                    </div>
                    <div className="font-small-1">Events</div>
                  </div>
                </div>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                  <div>
                    <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>$153,596.36</strong>
                    </div>
                    <div className="font-small-1">Total</div>
                  </div>
                </div>
              </CardText>
            </CardBody>
            <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
              <Button
                color="primary"
                outline
                className=" m-0 btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setStatus('Deposit paid');
                }}
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6" xl="2">
          <Card>
            <CardBody className="pt-1 pb-1">
              <CardTitle className="text-center mb-0">
                <h6>Paid</h6>
              </CardTitle>
              <CardText>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                  <div>
                    <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>459</strong>
                    </div>
                    <div className="font-small-1">Events</div>
                  </div>
                </div>
                <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                  <div>
                    <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                  </div>
                  <div className="pl-1 m-0">
                    <div>
                      <strong>$153,596.36</strong>
                    </div>
                    <div className="font-small-1">Total</div>
                  </div>
                </div>
              </CardText>
            </CardBody>
            <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
              <Button
                color="primary"
                outline
                className=" m-0 btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setStatus('Paid');
                }}
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <div className="datatable">
        <h4 className="mb-2">
          Bookings <Badge color="light-primary">{status}</Badge>
        </h4>

        <ReactDataGrid
          idProperty="_id"
          className="bookings-table text-small"
          style={gridStyle}
          columns={columns}
          filteredRowsCount={setFilteredRows}
          defaultFilterValue={defaultFilterValue}
          pagination
          livePagination
          dataSource={dataSource}
          onSortInfoChange={setSortInfo}
          onFilterValueChange={setFilterValue}
          showZebraRows={true}
          theme={skin === 'dark' ? 'amber-dark' : 'default-light'}
          cellSelection={cellSelection}
          onCellSelectionChange={setCellSelection}
          enableClipboard={true}
          onCopySelectedCellsChange={onCopySelectedCellsChange}
          onPasteSelectedCellsChange={onPasteSelectedCellsChange}
          expandedRows={expandedRows}
          collapsedRows={collapsedRows}
          onExpandedRowsChange={onExpandedRowsChange}
          rowExpandHeight={380}
          renderRowDetails={renderRowDetails}
        />
      </div>
    </div>
  );
};

export default DataGrid;

ReactDataGrid.defaultProps.filterTypes.string = {
  type: 'string',
  emptyValue: '',
  operators: [
    {
      name: 'contains',
      fn: {}
    }
  ]
};
