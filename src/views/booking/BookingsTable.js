import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { apolloClient } from '../../utility/RealmApolloClient';

import queryGetBookingsWithCriteria from '../../graphql/QueryGetBookingsWithCriteria';

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
import { DollarSign, TrendingUp } from 'react-feather';
import { Badge, Button, Card, CardBody, CardTitle, CardText, CardFooter, Col, Row } from 'reactstrap';

const renderRowDetails = ({ data, toggleRowExpand, rowSelected, rowActive, dataSource, rowId }) => {
  console.log('data', data);
  console.log('rowSelected', rowSelected);
  console.log('rowActive', rowActive);
  console.log('rowId', rowId);
  console.log('dataSource', dataSource);
  return (
    <div style={{ padding: 20 }}>
      <h3>
        <Button onClick={toggleRowExpand}>Collapse row</Button>
      </h3>
      <h3>Row details:</h3>
      <table>
        <tbody>
          {Object.keys(data).map((name, i) => {
            // console.log('i', i);
            // console.log('name', name);
            return (
              <tr key={i}>
                <td>{name}</td>
                <td>{data[name]}</td>
              </tr>
            );
          })}
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
  { name: 'attendees', header: '# ', type: 'number', filterEditor: NumberFilter },
  {
    name: 'eventDateTime',
    header: 'Event date ',
    type: 'date',
    filterEditor: DateFilter,
    render: ({ value, cellProps }) => {
      if (value) {
        return moment(value).format('LLL');
      }
    }
  }
];

const DataGrid = () => {
  const skin = useSelector((state) => state.bookingsBackground);
  const [status, setStatus] = useState('quote');

  const gridStyle = { minHeight: 600, marginTop: 10 };

  const defaultExpandedRows = { 1: true };

  const defaultFilterValue = [
    { name: 'updatedAt', type: 'date', operator: 'before', value: undefined },
    { name: '_id', type: 'string', operator: 'contains', value: '' },
    { name: 'status', type: 'string', operator: 'contains', value: status },
    { name: 'customerName', type: 'string', operator: 'contains', value: '' },
    { name: 'customerEmail', type: 'string', operator: 'contains', value: '' },
    { name: 'customerCompany', type: 'string', operator: 'contains', value: '' },
    { name: 'className', type: 'string', operator: 'contains', value: '' },
    { name: 'attendees', type: 'number', operator: 'gte', value: 10 },
    { name: 'eventDateTime', type: 'date', operator: 'before', value: undefined }
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
  // const [cellSelection, setCellSelection] = useState({});

  console.log('filteredRows', filteredRows);
  const onExpandedRowsChange = useCallback(({ expandedRows, collapsedRows }) => {
    setExpandedRows(expandedRows);
    setCollapsedRows(collapsedRows);
  }, []);

  // const onCopySelectedCellsChange = useCallback((cells) => {
  //   console.log(cells);
  // }, []);

  // const onPasteSelectedCellsChange = useCallback((cells) => {
  //   console.log(cells);
  // }, []);

  // console.log('ReactDataGrid', ReactDataGrid.defaultProps.i18n);
  console.log('ReactDataGrid', ReactDataGrid.rowProps);

  return (
    <div>
      <Row className="d-flex justify-content-between mt-1">
        <Col md="6" xl="2">
          <Card className="">
            <CardBody className="pt-1">
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
            <CardFooter className="d-flex justify-content-center">
              <Button
                color="primary"
                outline
                className=" m-0 btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setStatus('quote');
                }}
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6" xl="2">
          <Card>
            <CardBody className="pt-1">
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
            <CardFooter className="d-flex justify-content-center">
              <Button
                color="primary"
                outline
                className=" m-0 btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setStatus('date-requested');
                }}
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6" xl="2">
          <Card>
            <CardBody className="pt-1">
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
            <CardFooter className="d-flex justify-content-center">
              <Button color="primary" outline className=" m-0 btn-sm">
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6" xl="2">
          <Card>
            <CardBody className="pt-1">
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
            <CardFooter className="d-flex justify-content-center">
              <Button color="primary" outline className=" m-0 btn-sm">
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6" xl="2">
          <Card>
            <CardBody className="pt-1">
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
            <CardFooter className="d-flex justify-content-center">
              <Button color="primary" outline className=" m-0 btn-sm">
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6" xl="2">
          <Card>
            <CardBody className="pt-1">
              <CardTitle className="text-center mb-0">
                <h6>Paid (Full)</h6>
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
            <CardFooter className="d-flex justify-content-center">
              <Button color="primary" outline className=" m-0 btn-sm">
                Details
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>

      {/* <div style={{ height: 80 }}>Current filterValue: {filterValue ? <code>{JSON.stringify(filterValue, null, 2)}</code> : 'none'}.</div> */}
      <p>Expanded rows: {expandedRows === null ? 'none' : JSON.stringify(expandedRows, null, 2)}.</p>
      {expandedRows === true ? <p>Collapsed rows: {collapsedRows === null ? 'none' : JSON.stringify(collapsedRows, null, 2)}.</p> : null}
      <div className="datatable">
        <h4 className="mt-1 mb-3">
          Bookings <Badge color="light-primary">{status}</Badge>
        </h4>
        <div>
          <Button onClick={() => setExpandedRows(true)} style={{ marginRight: 10 }}>
            Expand all
          </Button>
          <Button onClick={() => setExpandedRows({})}>Collapse all</Button>
        </div>
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
          // cellSelection={cellSelection}
          // onCellSelectionChange={setCellSelection}
          // enableClipboard={true}
          // onCopySelectedCellsChange={onCopySelectedCellsChange}
          // onPasteSelectedCellsChange={onPasteSelectedCellsChange}
          expandedRows={expandedRows}
          collapsedRows={collapsedRows}
          onExpandedRowsChange={onExpandedRowsChange}
          rowExpandHeight={400}
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
