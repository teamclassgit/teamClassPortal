import React, { useState, useCallback } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import '@inovua/reactdatagrid-enterprise/index.css';

import Button from '@inovua/reactdatagrid-community/packages/Button';

const people = [
  {
    id: 0,
    firstName: 'Bill',
    name: 'Bill',
    student: true,
    age: 20,
    city: 'Manchester',
    country: 'uk',
    email: 'bill@manchester.uk',
    birthDate: '1980-11-29T00:00:00Z'
  },
  {
    id: 1,
    firstName: 'Mary',
    name: 'Mary',
    age: 22,
    student: true,
    city: 'New York',
    country: 'usa',
    email: 'mary.mary@gmail.com',
    birthDate: '1982-11-30T00:00:00Z'
  },
  {
    id: 2,
    firstName: 'John',
    name: 'John',
    age: 32,
    student: false,
    city: 'London',
    country: 'uk',
    email: 'john@London.com',
    birthDate: '1970-12-01T00:00:00Z'
  },
  {
    id: 3,
    firstName: 'Boby',
    name: 'Boby',
    age: 32,
    student: false,
    city: 'Vancouver',
    country: 'ca',
    email: 'boby@vancouver.com',
    birthDate: '1987-12-02T00:00:00Z'
  },
  {
    id: 4,
    firstName: 'Billy',
    name: 'Billy',
    age: 32,
    student: false,
    city: 'Edmonton',
    email: 'billy@edmonton.ca',
    country: 'ca',
    birthDate: '1990-12-03T00:00:00Z'
  },
  {
    id: 5,
    firstName: 'Johny',
    name: 'Johny',
    age: 32,
    student: true,
    city: 'San Jose',
    country: 'usa',
    email: 'johny@yahoo.com',
    birthDate: '1989-12-04T00:00:00Z'
  },
  {
    id: 6,
    firstName: 'Hilly',
    name: 'Hilly',
    age: 32,
    student: true,
    city: 'London',
    country: 'uk',
    email: 'hilly@london.co.uk',
    birthDate: '2010-12-05T00:00:00Z'
  },
  {
    id: 7,
    firstName: 'Hillaay',
    name: 'Hillaay',
    age: 47,
    student: false,
    city: 'Bristol',
    country: 'uk',
    email: 'hillaay@britain.com',
    birthDate: '1987-12-06T00:00:00Z'
  },
  {
    id: 8,
    firstName: 'Matthew',
    name: 'Matthew',
    age: 47,
    student: false,
    city: 'Leeds',
    country: 'uk',
    email: 'matthew@leeds.co.uk',
    birthDate: '2007-12-07T00:00:00Z'
  },
  {
    id: 9,
    firstName: 'David',
    name: 'David',
    age: 48,
    student: false,
    city: 'Toronto',
    country: 'ca',
    email: 'david@toronto.com',
    birthDate: '1979-12-08T00:00:00Z'
  },
  {
    id: 10,
    firstName: 'Richard',
    name: 'Richard',
    age: 9,
    student: false,
    city: 'Ottawa',
    country: 'ca',
    email: 'richard@ottawa.ca',
    birthDate: '2000-12-09T00:00:00Z'
  },
  {
    id: 11,
    firstName: 'Hillary',
    name: 'Hillary',
    age: 34,
    student: true,
    city: 'Los Angeles',
    email: 'hillary@gmail.com',
    country: 'usa',
    birthDate: '1982-12-10T00:00:00Z'
  },
  {
    id: 12,
    firstName: 'Maria',
    name: 'Williams',
    age: 32,
    student: true,
    city: 'New York',
    email: 'maria@gmail.com',
    country: 'usa',
    birthDate: '1981-12-11T00:00:00Z'
  }
];

const gridStyle = { minHeight: 550 };

const renderRowDetails = ({ data, toggleRowExpand, rowSelected, rowActive, dataSource, rowId }) => {
  console.log('data', data);
  console.log('rowSelected', rowSelected);
  console.log('rowActive', rowActive);
  console.log('rowId', rowId);
  return (
    <div style={{ padding: 20 }}>
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

console.log(people);
const columns = [
  { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 80 },
  { name: 'name', header: 'Name', defaultWidth: 120 },
  { name: 'email', header: 'Email', defaultWidth: 120 },
  { name: 'country', header: 'Country', defaultWidth: 120 },
  { name: 'city', header: 'City', defaultWidth: 120 },
  { name: 'age', header: 'Age', type: 'number', defaultWidth: 120 }
];

const App = () => {
  const [expandedRows, setExpandedRows] = useState({ 1: true, 2: true });
  const [collapsedRows, setCollapsedRows] = useState(null);

  const onExpandedRowsChange = useCallback(({ expandedRows, collapsedRows }) => {
    setExpandedRows(expandedRows);
    setCollapsedRows(collapsedRows);
  }, []);

  return (
    <div>
      <h3>Grid showing row details on expand - controlled</h3>
      <div>
        <Button onClick={() => setExpandedRows(true)} style={{ marginRight: 10 }}>
          Expand all
        </Button>
        <Button onClick={() => setExpandedRows({})}>Collapse all</Button>
      </div>
      <p>Expanded rows: {expandedRows === null ? 'none' : JSON.stringify(expandedRows, null, 2)}.</p>
      {expandedRows === true ? <p>Collapsed rows: {collapsedRows === null ? 'none' : JSON.stringify(collapsedRows, null, 2)}.</p> : null}

      <ReactDataGrid
        idProperty="id"
        expandedRows={expandedRows}
        collapsedRows={collapsedRows}
        onExpandedRowsChange={onExpandedRowsChange}
        style={gridStyle}
        rowExpandHeight={400}
        renderRowDetails={renderRowDetails}
        columns={columns}
        dataSource={people}
      />
    </div>
  );
};

export default () => <App />;
