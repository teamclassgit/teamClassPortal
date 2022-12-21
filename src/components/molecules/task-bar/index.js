// @packages
import React, { useState } from "react";
import { Button, ButtonGroup, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner, UncontrolledButtonDropdown } from "reactstrap";
import { Share, Plus } from "react-feather";
import PropTypes from "prop-types";
import ExportToExcel from "@molecules/export-to-excel";

const TasksBar = ({ titleView, titleBadge, setElementToAdd, showAddModal, getDataToExport, fileExportedName, buttonTitle }) => {
  const [isExporting, setIsExporting] = useState(false);

  return (
    <Row>
      <Col md={6} lg={6}>
        <h4>
          {titleView}
          {" "}
          <small>
            <a href="#">{titleBadge}</a>
          </small>
        </h4>
      </Col>
      <Col lg={6} md={6}>
        <div align="right">
          <ButtonGroup>
            <UncontrolledButtonDropdown>
              {!isExporting && (
                <>
                  <DropdownToggle color="primary" caret outline title="Export">
                    <Share size={13} />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem className="align-middle w-100">
                      <ExportToExcel
                        apiDataFunc={async () => {
                          return await getDataToExport();
                        }}
                        fileName={fileExportedName}
                        setIsExporting={setIsExporting}
                      />
                    </DropdownItem>
                  </DropdownMenu>
                </>
              )}
              {isExporting && (
                <DropdownToggle color="primary" caret outline title="Exporting..." disabled={true}>
                  <Spinner size="sm" />
                </DropdownToggle>
              )}
            </UncontrolledButtonDropdown>
            <Button
              outline
              color="primary"
              onClick={(e) => {
                const newElement = {
                  name: "",
                  email: "",
                  phone: "",
                  company: "",
                  attendees: ""
                };
                setElementToAdd(newElement);
                showAddModal();
              }}
              title={buttonTitle}
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
  showAddModal: PropTypes.func.isRequired,
  getDataToExport: PropTypes.func.isRequired,
  fileExportedName: PropTypes.string,
  buttonTitle: PropTypes.string
};

TasksBar.defaultProps = {
  fileExportedName: "Bookings",
  buttonTitle: "Add Booking"
};
