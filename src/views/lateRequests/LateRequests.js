// @packages
import React from 'react';
import PropTypes from 'prop-types';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import { FileText, Share } from 'react-feather';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import StringFilter from '@inovua/reactdatagrid-community/StringFilter';

// @Scrips
import ExportToExcelLegacy from '../../components/ExportToExcelLegacy';

// @Styles
import '@inovua/reactdatagrid-enterprise/index.css';
import '@inovua/reactdatagrid-enterprise/theme/default-light.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-dark.css';

const LateRequests = () => {
  return (
    <>
      <div className="d-flex justify-content-between mb-2">
        <h4>All Attendees</h4>
        <UncontrolledButtonDropdown>
          <DropdownToggle color="primary" caret outline title="Export">
            <Share size={13} />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem className="align-middle w-100">
              <ExportToExcelLegacy
                // apiData={classVariantsExcelTable}
                fileName={'Listing Prices'}
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
        // style={gridStyle}
        // columns={columns}
        // loading={false}
        // filterValue={filterValue}
        // onFilterValueChange={setFilterValue}
        // dataSource={dataSource || []}
        licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
        theme={skin === 'dark' ? 'amber-dark' : 'default-light'}
      />
    </>
  );
};

LateRequests.propTypes = {};

export default LateRequests;
