import React, { useState, useCallback } from 'react';
import { apolloClient } from '../../utility/RealmApolloClient';
import { useQuery, useLazyQuery } from '@apollo/client';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import '@inovua/reactdatagrid-enterprise/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-dark.css';
import './BookingsTable.scss';
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';

import Button from '@inovua/reactdatagrid-community/packages/Button';

import moment from 'moment';

import queryGetBookingsWithCriteria from '../../graphql/QueryGetBookingsWithCriteria';

const DataGrid = () => {
  const gridStyle = { minHeight: 600, marginTop: 10 };

  const defaultFilterValue = [
    { name: 'updatedAt', type: 'date', operator: 'before', value: undefined },
    { name: '_id', type: 'string', operator: 'contains', value: '' },
    { name: 'status', type: 'string', operator: 'contains', value: '' },
    { name: 'customerName', type: 'string', operator: 'contains', value: '' },
    { name: 'customerEmail', type: 'string', operator: 'contains', value: '' },
    { name: 'customerCompany', type: 'string', operator: 'contains', value: '' },
    { name: 'className', type: 'string', operator: 'contains', value: '' },
    { name: 'attendees', type: 'number', operator: 'gte', value: 10 },
    { name: 'eventDateTime', type: 'date', operator: 'before', value: undefined }
  ];

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

  return (
    <div>
      <h4 className="mt-3 mb-3">Bookings</h4>
      {/* <div style={{ height: 80 }}>Current filterValue: {filterValue ? <code>{JSON.stringify(filterValue, null, 2)}</code> : 'none'}.</div> */}
      <div className="datatable">
        <ReactDataGrid
          idProperty="id"
          className="bookings-table"
          style={gridStyle}
          columns={columns}
          defaultFilterValue={defaultFilterValue}
          pagination
          livePagination
          dataSource={dataSource}
          onSortInfoChange={setSortInfo}
          onFilterValueChange={setFilterValue}
          // theme="amber-dark"
        />
      </div>
    </div>
  );
};

export default DataGrid;

// ReactDataGrid.defaultProps.filterTypes = {
//   string: {
//     type: 'string',
//     emptyValue: undefined,
//     operators: [
//       {
//         name: 'contains'
//       }
//     ]
//   }
// };
