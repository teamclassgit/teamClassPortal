// @packages
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import { FileText, Share } from 'react-feather';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';

// @Scrips
import columns from './columns';
import ExportToExcelLegacy from '../../components/ExportToExcelLegacy';
import queryAllAttendees from '../../graphql/QueryAllAttendees';

// @Styles
import '@inovua/reactdatagrid-enterprise/index.css';
import '@inovua/reactdatagrid-enterprise/theme/default-light.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-dark.css';

const gridStyle = { minHeight: 650, marginTop: 10 };

const LateRequests = () => {
  const skin = useSelector((state) => state.bookingsBackground);
  const [dataSourceAttendees, setDataSourceAttendees] = useState([]);
  const [attendeesToExcelTable, setAttendeesToExcelTable] = useState([]);
  const [filterValue, setFilterValue] = useState([
    { name: 'bookingId', operator: 'startsWith', type: 'string', value: '' },
    { name: 'name', operator: 'startsWith', type: 'string', value: '' },
    { name: 'status', operator: 'startsWith', type: 'string', value: '' }
  ]);

  const { loading } = useQuery(queryAllAttendees, {
    fetchPolicy: 'cache-and-network',
    variables: {
      query: {
        status_ne: "confirmed"
      }
    },
    onCompleted: (data) => {
      if (data?.attendees) {
        setDataSourceAttendees(data?.attendees);
      }
    }
  });

  useEffect(() => {
    if (dataSourceAttendees) {
      const attendeesArray = [];
      const headers = [
        'bookingId',
        'status',
        'name',
        'email',
        'phone',
        'addressLine1',
        'addressLine2',
        'country',
        'state',
        'city',
        'zip'
      ];

      attendeesArray.push(headers);

      for (const i in dataSourceAttendees) {
        const row = [
          dataSourceAttendees[i].bookingId,
          dataSourceAttendees[i].status,
          dataSourceAttendees[i].name,
          dataSourceAttendees[i].email,
          dataSourceAttendees[i].phone,
          dataSourceAttendees[i].addressLine1,
          dataSourceAttendees[i].addressLine2,
          dataSourceAttendees[i].country,
          dataSourceAttendees[i].state,
          dataSourceAttendees[i].city,
          dataSourceAttendees[i].zip
        ];

        attendeesArray.push(row);
      }
      setAttendeesToExcelTable(attendeesArray);
    }
  }, [dataSourceAttendees]);

  return (
    <>
      <div className="d-flex justify-content-between mb-2">
        <h4>
          All Attendees
          <Badge color="primary" className='ml-1'>{dataSourceAttendees.length}</Badge>
        </h4>
        <UncontrolledButtonDropdown>
          <DropdownToggle color="primary" caret outline title="Export">
            <Share size={13} />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem className="align-middle w-100">
              <ExportToExcelLegacy
                apiData={attendeesToExcelTable}
                fileName={'Late Attendees'}
                title={
                  <h6 className="p-0">
                    <FileText size={13} />
                    {'Excel file'}
                  </h6>
                }
              />
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
      <ReactDataGrid
        idProperty="bookingId"
        columns={columns}
        loading={loading}
        style={gridStyle}
        defaultFilterValue={filterValue}
        onFilterValueChange={setFilterValue}
        dataSource={dataSourceAttendees}
        licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
        minRowHeight={50}
        rowHeight={null}
        theme={skin === 'dark' ? 'amber-dark' : 'default-light'}
      />
    </>
  );
};

LateRequests.propTypes = {};

export default LateRequests;
