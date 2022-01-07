import React, { useState, useCallback } from 'react';
import { apolloClient } from '../../../utility/RealmApolloClient';
import { useQuery, useLazyQuery } from '@apollo/client';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import '@inovua/reactdatagrid-enterprise/index.css';

import Button from '@inovua/reactdatagrid-community/packages/Button';

import queryGetBookingsWithCriteria from '../../../graphql/QueryGetBookingsWithCriteria';

const DataGrid = () => {
  const gridStyle = { minHeight: 600, marginTop: 10 };
  // const [limit, setLimit] = useState([]);
  const [genericFilter] = useState({});

  const defaultFilterValue = [
    { name: 'id', type: 'string', operator: 'contains', value: '' },
    { name: 'updatedAt', type: 'string', operator: 'contains', value: '' },
    { name: 'customerName', type: 'string', operator: 'contains', value: '' }
  ];

  const columns = [
    { name: 'updatedAt', header: 'Updated', type: 'date', defaultFlex: 1 },
    { name: 'id', header: 'Id', defaultFlex: 1 },
    { name: 'customerName', header: 'Customer Name', defaultFlex: 1 },
    { name: 'attendees', header: 'Attendees', groupBy: false, defaultFlex: 1 }
  ];

  const loadData = ({ skip, limit, sortInfo, groupBy, filterValue }) => {
    console.log('limit', limit);
    // const allBookings = async () => {
    //   const bookings = await apolloClient.query({
    //     query: queryGetBookingsWithCriteria,
    //     variables: {
    //       limit,
    //       offset: skip
    //     }
    //   });
    //   console.log('bookings', bookings);
    // };
    // allBookings();

    // return { data: [], count: 0 };
    return apolloClient
      .query({
        query: queryGetBookingsWithCriteria,
        variables: {
          limit,
          offset: skip
        }
      })
      .then((response) => {
        console.log('entró', response);
        const totalCount = 1000000;
        return { data: response.data.getBookingsWithCriteria, count: totalCount * 1 };
      });

    // return fetch(
    //   `${bookings}?skip=${skip}&limit=${limit}${groupBy && groupBy.length ? `&groupBy=${groupBy}` : ''}&sortInfo=${JSON.stringify(
    //     sortInfo
    //   )}&filterBy=${JSON.stringify(filterValue)}`
    // ).then((response) => {
    //   const totalCount = response.headers.get('X-Total-Count');
    //   return response.json().then((data) => {
    //     return { data, count: totalCount * 1 };
    //   });
    // });
  };

  const [filterValue, setFilterValue] = useState(defaultFilterValue);
  const [sortInfo, setSortInfo] = useState([]);

  const dataSource = useCallback(loadData, []);

  return (
    <div>
      <h3>Remote filtering & sorting example with pagination</h3>
      <div style={{ height: 80 }}>Current filterValue: {filterValue ? <code>{JSON.stringify(filterValue, null, 2)}</code> : 'none'}.</div>
      <ReactDataGrid
        idProperty="id"
        style={gridStyle}
        columns={columns}
        defaultFilterValue={defaultFilterValue}
        defaultGroupBy={[]}
        pagination
        livePagination
        dataSource={dataSource}
        onSortInfoChange={setSortInfo}
        onFilterValueChange={setFilterValue}
      />
    </div>
  );
};

export default DataGrid;
