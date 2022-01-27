// @packages
import React from 'react';
import { Button, ButtonGroup, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledButtonDropdown } from 'reactstrap';
import { Share, FileText, Plus } from 'react-feather';
import PropTypes from 'prop-types';
import ExportToExcel from './ExportToExcel';

const TasksBar = ({ titleView, titleBadge, setElementToAdd, showAddModal }) => {
  return (
    <Row>
      <Col md={6} lg={6}>
        <h4>
          {titleView}
          {` `}
          <small>
            <a href="#">{titleBadge}</a>
          </small>
        </h4>
      </Col>
      <Col lg={6} md={6}>
        <div align="right">
          <ButtonGroup>
            <UncontrolledButtonDropdown>
              <DropdownToggle color="primary" caret outline title="Export">
                <Share size={13} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem className="align-middle w-100">
                  <ExportToExcel
                    apiData={[]}
                    fileName={'Bookings'}
                    title={
                      <h6>
                        <FileText size={13} />
                        {' Excel File'}
                      </h6>
                    }
                    smallText={<h6 className="small m-0 p-0">Download</h6>}
                  />
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <Button
              outline
              color="primary"
              onClick={(e) => {
                const newElement = {
                  name: '',
                  email: '',
                  phone: '',
                  company: '',
                  attendees: ''
                };
                setElementToAdd(newElement);
                showAddModal();
              }}
              title="Add Booking"
            >
              <Plus size={13} />
            </Button>
          </ButtonGroup>
        </div>
      </Col>
    </Row>
  );
};

export default TasksBar;

TasksBar.propTypes = {
  titleView: PropTypes.string.isRequired,
  titleBadge: PropTypes.string.isRequired,
  setElementToAdd: PropTypes.func.isRequired,
  showAddModal: PropTypes.func.isRequired
};
